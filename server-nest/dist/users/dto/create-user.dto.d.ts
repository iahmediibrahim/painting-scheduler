import { UserRole } from '../../auth/decorators/roles.decorator';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}
