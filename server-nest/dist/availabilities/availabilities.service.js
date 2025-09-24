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
exports.AvailabilitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const booking_status_enum_1 = require("../common/enums/booking-status.enum");
let AvailabilitiesService = class AvailabilitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAvailabilityDto, userId) {
        const startTime = new Date(createAvailabilityDto.startTime);
        const endTime = new Date(createAvailabilityDto.endTime);
        const date = new Date(startTime);
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
    async findAll(role, userId) {
        if (role === roles_decorator_1.UserRole.PAINTER) {
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
        }
        else {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Availability not found');
        }
        return availability;
    }
    async update(id, updateAvailabilityDto, userId) {
        const availability = await this.prisma.availability.findUnique({
            where: { id },
        });
        if (!availability) {
            throw new common_1.NotFoundException('Availability not found');
        }
        if (availability.painterId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this availability');
        }
        return this.prisma.availability.update({
            where: { id },
            data: {
                ...(updateAvailabilityDto.startTime && { startTime: new Date(updateAvailabilityDto.startTime) }),
                ...(updateAvailabilityDto.endTime && { endTime: new Date(updateAvailabilityDto.endTime) }),
            },
        });
    }
    async remove(id, userId) {
        const availability = await this.prisma.availability.findUnique({
            where: { id },
            include: {
                bookings: true,
            },
        });
        if (!availability) {
            throw new common_1.NotFoundException('Availability not found');
        }
        if (availability.painterId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this availability');
        }
        const hasConfirmedBookings = availability.bookings.some(booking => booking.status === booking_status_enum_1.BookingStatus.ACCEPTED || booking.status === booking_status_enum_1.BookingStatus.COMPLETED);
        if (hasConfirmedBookings) {
            throw new common_1.ForbiddenException('Cannot delete availability with confirmed or completed bookings');
        }
        return this.prisma.availability.delete({
            where: { id },
        });
    }
};
exports.AvailabilitiesService = AvailabilitiesService;
exports.AvailabilitiesService = AvailabilitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilitiesService);
//# sourceMappingURL=availabilities.service.js.map