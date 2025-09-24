import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../auth/decorators/roles.decorator';
import { BookingStatus } from '../common/enums/booking-status.enum';

@Injectable()
export class AvailabilitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createAvailabilityDto: CreateAvailabilityDto, userId: string) {
    // Validate dates before creating
    const startTime = new Date(createAvailabilityDto.startTime);
    const endTime = new Date(createAvailabilityDto.endTime);
    
    // Use the date from startTime for the date field
    const date = new Date(startTime);
    
    // Check if dates are valid
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error('Invalid date format provided');
    }
    
    return this.prisma.availability.create({
      data: {
        date: date,
        startTime: startTime,
        endTime: endTime,
        painter: { connect: { id: userId } },
      },
    });
  }

  async findAll(role: UserRole, userId?: string) {
    if (role === UserRole.PAINTER) {
      return this.prisma.availability.findMany({
        where: { painterId: userId },
        include: {
          bookings: {
            select: {
              id: true,
              status: true,
              startTime: true,
              endTime: true,
              address: true,
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } else {
      // For customers, show all availabilities that don't have bookings or have rejected bookings
      return this.prisma.availability.findMany({
        where: {
          OR: [
            { bookings: { none: {} } },
            { bookings: { every: { status: 'REJECTED' } } },
          ],
        },
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
    }
  }

  async findOne(id: string) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
      include: {
        painter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
            startTime: true,
            endTime: true,
            address: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    return availability;
  }

  async update(id: string, updateAvailabilityDto: UpdateAvailabilityDto, userId: string) {
    // Check if the availability exists
    const availability = await this.prisma.availability.findUnique({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    // Check if the user has permission to update this availability
    if (availability.painterId !== userId) {
      throw new ForbiddenException('You do not have permission to update this availability');
    }

    // Update the availability
    return this.prisma.availability.update({
      where: { id },
      data: {
        ...(updateAvailabilityDto.startTime && { startTime: new Date(updateAvailabilityDto.startTime) }),
        ...(updateAvailabilityDto.endTime && { endTime: new Date(updateAvailabilityDto.endTime) }),
      },
    });
  }

  async remove(id: string, userId: string) {
    // Check if the availability exists
    const availability = await this.prisma.availability.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    // Check if the user has permission to delete this availability
    if (availability.painterId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this availability');
    }

    // Check if there are any confirmed bookings
    const hasConfirmedBookings = availability.bookings.some(
      booking => booking.status === BookingStatus.ACCEPTED || booking.status === BookingStatus.COMPLETED
    );

    if (hasConfirmedBookings) {
      throw new ForbiddenException('Cannot delete availability with confirmed or completed bookings');
    }

    // Delete the availability
    return this.prisma.availability.delete({
      where: { id },
    });
  }
}
