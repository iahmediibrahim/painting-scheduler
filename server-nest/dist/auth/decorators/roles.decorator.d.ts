export declare enum UserRole {
    CUSTOMER = "CUSTOMER",
    PAINTER = "PAINTER"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
