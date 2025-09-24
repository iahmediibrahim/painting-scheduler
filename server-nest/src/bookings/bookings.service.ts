import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../auth/decorators/roles.decorator';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
    // Always check for available slots first
    // Find available slots based on the booking criteria
    const availableSlots = await this.findAvailableSlots(
      createBookingDto.startTime,
      createBookingDto.endTime,
      createBookingDto.painterId,
    );

    if (availableSlots.length === 0) {
      // If no exact match found, always try to find closest available slot
      const closestSlot = await this.findClosestAvailableSlot(
        createBookingDto.startTime,
        createBookingDto.endTime,
        createBookingDto.painterId,
      );

      if (closestSlot) {
        // Get painter details if available
        const painter = closestSlot.painterId ? 
          await this.prisma.user.findUnique({
            where: { id: closestSlot.painterId },
          }) : null;

        throw new ForbiddenException({
          message: `Closest available slot found`,
          closestAvailableSlot: {
            startTime: closestSlot.startTime,
            endTime: closestSlot.endTime,
            message: `Closest available: ${new Date(closestSlot.startTime).toLocaleDateString()} at ${new Date(closestSlot.startTime).toLocaleTimeString()}`,
            painter: painter,
          },
        });
      } else {
        throw new NotFoundException(
          'No available slots found in the next 7 days',
        );
      }
    }

    // Find the best painter if multiple slots available
    const bestMatch = await this.findBestPainter(availableSlots);
    if (!bestMatch) {
      throw new NotFoundException(
        'No suitable painter found for the requested time',
      );
    }

    // Create the booking
    const newBooking = await this.prisma.booking.create({
      data: {
        date: new Date(createBookingDto.date || createBookingDto.startTime),
        startTime: new Date(createBookingDto.startTime),
        endTime: new Date(createBookingDto.endTime),
        address: createBookingDto.address || 'Default address',
        status: BookingStatus.PENDING,
        customer: { connect: { id: userId } },
        painter: { connect: { id: bestMatch.painterId } },
      },
      include: {
        customer: true,
        painter: true,
      },
    });

    // Update availability after booking (split or remove)
    await this.updateAvailabilityAfterBooking(
      bestMatch,
      createBookingDto.startTime,
      createBookingDto.endTime,
    );

    return newBooking;
  }

  // Find available slots for a booking request
  private async findAvailableSlots(
    startTime: string,
    endTime: string,
    painterId?: string,
  ) {
    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(endTime);

    return this.prisma.availability.findMany({
      where: {
        // If painterId is specified, filter by that painter
        ...(painterId && { painterId }),
        // Find availabilities that can accommodate the booking
        startTime: { lte: bookingStart },
        endTime: { gte: bookingEnd },
      },
      include: {
        painter: true,
      },
    });
  }

  // Find the best painter based on ratings or availability
  private async findBestPainter(availableSlots: any[]) {
    if (availableSlots.length === 0) {
      return null;
    }

    // If we have painter data with ratings, we could sort by rating here
    // For now, just return the first available slot
    return availableSlots[0];
  }

  // Find closest available slot if exact match not found
  private async findClosestAvailableSlot(
    startTime: string,
    endTime: string,
    painterId?: string,
  ) {
    const requestedStartTime = new Date(startTime);
    const duration = new Date(endTime).getTime() - requestedStartTime.getTime();

    // Search for available slots in the next 7 days
    for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
      for (let hourOffset = 0; hourOffset <= 12; hourOffset += 2) {
        const slotStart = new Date(requestedStartTime);
        slotStart.setDate(slotStart.getDate() + dayOffset);
        slotStart.setHours(slotStart.getHours() + hourOffset, 0, 0, 0);

        const slotEnd = new Date(slotStart.getTime() + duration);

        // Check if any availability matches this slot
        const closestSlot = await this.prisma.availability.findFirst({
          where: {
            ...(painterId && { painterId }),
            startTime: { lte: slotStart },
            endTime: { gte: slotEnd },
          },
        });

        if (closestSlot) {
          return closestSlot;
        }
      }
    }

    return null;
  }

  // Update availability after a booking is created
  private async updateAvailabilityAfterBooking(
    availableSlot: any,
    startTime: string,
    endTime: string,
  ) {
    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(endTime);
    const availStart = new Date(availableSlot.startTime);
    const availEnd = new Date(availableSlot.endTime);

    // Delete the original availability
    await this.prisma.availability.delete({
      where: { id: availableSlot.id },
    });

    // Create availability for time before booking (if any)
    if (bookingStart > availStart) {
      await this.prisma.availability.create({
        data: {
          date: new Date(availStart),
          painter: { connect: { id: availableSlot.painterId } },
          startTime: availStart,
          endTime: bookingStart,
        },
      });
    }

    // Create availability for time after booking (if any)
    if (bookingEnd < availEnd) {
      await this.prisma.availability.create({
        data: {
          date: new Date(availEnd),
          painter: { connect: { id: availableSlot.painterId } },
          startTime: bookingEnd,
          endTime: availEnd,
        },
      });
    }
  }

  async findAll(userId: string, role: UserRole) {
    if (role === UserRole.CUSTOMER) {
      return this.prisma.booking.findMany({
        where: { customerId: userId },
        include: {
          painter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } else if (role === UserRole.PAINTER) {
      return this.prisma.booking.findMany({
        where: { painterId: userId },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    throw new ForbiddenException('Invalid role for accessing bookings');
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        painter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Check if the user has permission to access this booking
    if (
      (role === UserRole.CUSTOMER && booking.customerId !== userId) ||
      (role === UserRole.PAINTER && booking.painterId !== userId)
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this booking',
      );
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId: string,
    role: UserRole,
  ) {
    // Check if the booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if the user has permission to update this booking
    if (
      (role === UserRole.CUSTOMER && booking.customerId !== userId) ||
      (role === UserRole.PAINTER && booking.painterId !== userId)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this booking',
      );
    }

    // Update the booking
    return this.prisma.booking.update({
      where: { id },
      data: {
        ...(updateBookingDto.startTime && {
          startTime: new Date(updateBookingDto.startTime),
        }),
        ...(updateBookingDto.endTime && {
          endTime: new Date(updateBookingDto.endTime),
        }),
        ...(updateBookingDto.address && { address: updateBookingDto.address }),
      },
    });
  }

  async updateStatus(id: string, status: BookingStatus, userId: string) {
    // Check if the booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only painters can update booking status
    if (booking.painterId !== userId) {
      throw new ForbiddenException(
        'Only the assigned painter can update booking status',
      );
    }

    // Update the booking status
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string, userId: string, role: UserRole) {
    // Check if the booking exists
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if the user has permission to delete this booking
    if (
      (role === UserRole.CUSTOMER && booking.customerId !== userId) ||
      (role === UserRole.PAINTER && booking.painterId !== userId)
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this booking',
      );
    }

    // Delete the booking
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
