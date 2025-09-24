import { UserRole } from '../auth/decorators/roles.decorator';
import { BookingStatus } from '../common/enums/booking-status.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBookingDto: CreateBookingDto, userId: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        painter: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        painterId: string;
        availabilityId: string | null;
    }>;
    private findAvailableSlots;
    private findBestPainter;
    private findClosestAvailableSlot;
    private updateAvailabilityAfterBooking;
    findAll(userId: string, role: UserRole): Promise<({
        painter: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        painterId: string;
        availabilityId: string | null;
    })[] | ({
        customer: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        painterId: string;
        availabilityId: string | null;
    })[]>;
    findOne(id: string, userId: string, role: UserRole): Promise<{
        customer: {
            id: string;
            email: string;
            name: string;
        };
        painter: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        painterId: string;
        availabilityId: string | null;
    }>;
    update(id: string, updateBookingDto: UpdateBookingDto, userId: string, role: UserRole): Promise<{
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        painterId: string;
        availabilityId: string | null;
    }>;
    updateStatus(id: string, status: BookingStatus, userId: string): Promise<{
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        painterId: string;
        availabilityId: string | null;
    }>;
    remove(id: string, userId: string, role: UserRole): Promise<{
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        description: string | null;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        painterId: string;
        availabilityId: string | null;
    }>;
}
