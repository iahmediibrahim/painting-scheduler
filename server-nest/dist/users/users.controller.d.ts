import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findByRole(role: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
}
