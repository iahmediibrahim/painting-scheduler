import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '../common/enums/booking-status.enum';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateBookingDto: UpdateBookingDto, req: any): Promise<{
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
    updateStatus(id: string, status: BookingStatus, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
