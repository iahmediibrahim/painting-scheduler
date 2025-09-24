import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../auth/decorators/roles.decorator';
export declare class AvailabilitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAvailabilityDto: CreateAvailabilityDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        painterId: string;
    }>;
    findAll(role: UserRole, userId?: string): Promise<({
        bookings: {
            id: string;
            startTime: Date;
            endTime: Date;
            address: string;
            status: import("@prisma/client").$Enums.BookingStatus;
            customer: {
                name: string;
                email: string;
                id: string;
            };
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        painterId: string;
    })[] | ({
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
        painterId: string;
    })[]>;
    findOne(id: string): Promise<{
        bookings: {
            id: string;
            startTime: Date;
            endTime: Date;
            address: string;
            status: import("@prisma/client").$Enums.BookingStatus;
            customer: {
                name: string;
                email: string;
                id: string;
            };
        }[];
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
        painterId: string;
    }>;
    update(id: string, updateAvailabilityDto: UpdateAvailabilityDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        painterId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        painterId: string;
    }>;
}
