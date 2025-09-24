import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '../common/enums/booking-status.enum';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateBookingDto: UpdateBookingDto, req: any): Promise<{
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
    updateStatus(id: string, status: BookingStatus, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
