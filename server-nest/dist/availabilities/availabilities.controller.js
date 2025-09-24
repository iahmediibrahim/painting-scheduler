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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitiesController = void 0;
const common_1 = require("@nestjs/common");
const availabilities_service_1 = require("./availabilities.service");
const create_availability_dto_1 = require("./dto/create-availability.dto");
const update_availability_dto_1 = require("./dto/update-availability.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AvailabilitiesController = class AvailabilitiesController {
    availabilitiesService;
    constructor(availabilitiesService) {
        this.availabilitiesService = availabilitiesService;
    }
    create(createAvailabilityDto, req) {
        return this.availabilitiesService.create(createAvailabilityDto, req.user.id);
    }
    findAll(req) {
        return this.availabilitiesService.findAll(req.user.role, req.user.id);
    }
    findOne(id) {
        return this.availabilitiesService.findOne(id);
    }
    update(id, updateAvailabilityDto, req) {
        return this.availabilitiesService.update(id, updateAvailabilityDto, req.user.id);
    }
    remove(id, req) {
        return this.availabilitiesService.remove(id, req.user.id);
    }
};
exports.AvailabilitiesController = AvailabilitiesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.PAINTER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_availability_dto_1.CreateAvailabilityDto, Object]),
    __metadata("design:returntype", void 0)
], AvailabilitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CUSTOMER, roles_decorator_1.UserRole.PAINTER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AvailabilitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.CUSTOMER, roles_decorator_1.UserRole.PAINTER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvailabilitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.PAINTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_availability_dto_1.UpdateAvailabilityDto, Object]),
    __metadata("design:returntype", void 0)
], AvailabilitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.PAINTER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AvailabilitiesController.prototype, "remove", null);
exports.AvailabilitiesController = AvailabilitiesController = __decorate([
    (0, common_1.Controller)('availabilities'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [availabilities_service_1.AvailabilitiesService])
], AvailabilitiesController);
//# sourceMappingURL=availabilities.controller.js.map