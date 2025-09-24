"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const booking_status_enum_1 = require("../common/enums/booking-status.enum");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookingDto, userId) {
        const availableSlots = await this.findAvailableSlots(createBookingDto.startTime, createBookingDto.endTime, createBookingDto.painterId);
        if (availableSlots.length === 0) {
            const closestSlot = await this.findClosestAvailableSlot(createBookingDto.startTime, createBookingDto.endTime, createBookingDto.painterId);
            if (closestSlot) {
                const painter = closestSlot.painterId ?
                    await this.prisma.user.findUnique({
                        where: { id: closestSlot.painterId },
                    }) : null;
                throw new common_1.ForbiddenException({
                    message: `Closest available slot found`,
                    closestAvailableSlot: {
                        startTime: closestSlot.startTime,
                        endTime: closestSlot.endTime,
                        message: `Closest available: ${new Date(closestSlot.startTime).toLocaleDateString()} at ${new Date(closestSlot.startTime).toLocaleTimeString()}`,
                        painter: painter,
                    },
                });
            }
            else {
                throw new common_1.NotFoundException('No available slots found in the next 7 days');
            }
        }
        const bestMatch = await this.findBestPainter(availableSlots);
        if (!bestMatch) {
            throw new common_1.NotFoundException('No suitable painter found for the requested time');
        }
        const newBooking = await this.prisma.booking.create({
            data: {
                date: new Date(createBookingDto.date || createBookingDto.startTime),
                startTime: new Date(createBookingDto.startTime),
                endTime: new Date(createBookingDto.endTime),
                address: createBookingDto.address || 'Default address',
                status: booking_status_enum_1.BookingStatus.PENDING,
                customer: { connect: { id: userId } },
                painter: { connect: { id: bestMatch.painterId } },
            },
            include: {
                customer: true,
                painter: true,
            },
        });
        await this.updateAvailabilityAfterBooking(bestMatch, createBookingDto.startTime, createBookingDto.endTime);
        return newBooking;
    }
    async findAvailableSlots(startTime, endTime, painterId) {
        const bookingStart = new Date(startTime);
        const bookingEnd = new Date(endTime);
        return this.prisma.availability.findMany({
            where: {
                ...(painterId && { painterId }),
                startTime: { lte: bookingStart },
                endTime: { gte: bookingEnd },
            },
            include: {
                painter: true,
            },
        });
    }
    async findBestPainter(availableSlots) {
        if (availableSlots.length === 0) {
            return null;
        }
        return availableSlots[0];
    }
    async findClosestAvailableSlot(startTime, endTime, painterId) {
        const requestedStartTime = new Date(startTime);
        const duration = new Date(endTime).getTime() - requestedStartTime.getTime();
        for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
            for (let hourOffset = 0; hourOffset <= 12; hourOffset += 2) {
                const slotStart = new Date(requestedStartTime);
                slotStart.setDate(slotStart.getDate() + dayOffset);
                slotStart.setHours(slotStart.getHours() + hourOffset, 0, 0, 0);
                const slotEnd = new Date(slotStart.getTime() + duration);
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
    async updateAvailabilityAfterBooking(availableSlot, startTime, endTime) {
        const bookingStart = new Date(startTime);
        const bookingEnd = new Date(endTime);
        const availStart = new Date(availableSlot.startTime);
        const availEnd = new Date(availableSlot.endTime);
        await this.prisma.availability.delete({
            where: { id: availableSlot.id },
        });
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
    async findAll(userId, role) {
        if (role === roles_decorator_1.UserRole.CUSTOMER) {
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
        }
        else if (role === roles_decorator_1.UserRole.PAINTER) {
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
        throw new common_1.ForbiddenException('Invalid role for accessing bookings');
    }
    async findOne(id, userId, role) {
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
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        if ((role === roles_decorator_1.UserRole.CUSTOMER && booking.customerId !== userId) ||
            (role === roles_decorator_1.UserRole.PAINTER && booking.painterId !== userId)) {
            throw new common_1.ForbiddenException('You do not have permission to access this booking');
        }
        return booking;
    }
    async update(id, updateBookingDto, userId, role) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if ((role === roles_decorator_1.UserRole.CUSTOMER && booking.customerId !== userId) ||
            (role === roles_decorator_1.UserRole.PAINTER && booking.painterId !== userId)) {
            throw new common_1.ForbiddenException('You do not have permission to update this booking');
        }
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
    async updateStatus(id, status, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.painterId !== userId) {
            throw new common_1.ForbiddenException('Only the assigned painter can update booking status');
        }
        return this.prisma.booking.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id, userId, role) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if ((role === roles_decorator_1.UserRole.CUSTOMER && booking.customerId !== userId) ||
            (role === roles_decorator_1.UserRole.PAINTER && booking.painterId !== userId)) {
            throw new common_1.ForbiddenException('You do not have permission to delete this booking');
        }
        return this.prisma.booking.delete({
            where: { id },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map