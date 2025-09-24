import { AvailabilitiesService } from './availabilities.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
export declare class AvailabilitiesController {
    private readonly availabilitiesService;
    constructor(availabilitiesService: AvailabilitiesService);
    create(createAvailabilityDto: CreateAvailabilityDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        painterId: string;
    }>;
    findAll(req: any): Promise<({
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
    update(id: string, updateAvailabilityDto: UpdateAvailabilityDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        painterId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        painterId: string;
    }>;
}
