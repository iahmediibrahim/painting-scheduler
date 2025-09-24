import { UserRole } from '../auth/decorators/roles.decorator';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBookingDto: CreateBookingDto, userId: string): Promise<{
        painter: {
            name: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        customer: {
            name: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        address: string;
        painterId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        customerId: string;
        availabilityId: string | null;
    }>;
    private findAvailableSlots;
    private findBestPainter;
    private findClosestAvailableSlot;
    private updateAvailabilityAfterBooking;
    findAll(userId: string, role: UserRole): Promise<({
        painter: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        address: string;
        painterId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        customerId: string;
        availabilityId: string | null;
    })[] | ({
        customer: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        address: string;
        painterId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        customerId: string;
        availabilityId: string | null;
    })[]>;
    findOne(id: string, userId: string, role: UserRole): Promise<{
        painter: {
            name: string;
            email: string;
            id: string;
        };
        customer: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        address: string;
        painterId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        customerId: string;
        availabilityId: string | null;
    }>;
    update(id: string, updateBookingDto: UpdateBookingDto, userId: string, role: UserRole): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        address: string;
        painterId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        customerId: string;
        availabilityId: string | null;
    }>;
    updateStatus(id: string, status: BookingStatus, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        address: string;
        painterId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        customerId: string;
        availabilityId: string | null;
    }>;
    remove(id: string, userId: string, role: UserRole): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        address: string;
        painterId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        customerId: string;
        availabilityId: string | null;
    }>;
}
