import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, UserRole } from '../auth/decorators/roles.decorator';

@Controller('availabilities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Post()
  @Roles(UserRole.PAINTER)
  create(@Body() createAvailabilityDto: CreateAvailabilityDto, @Req() req) {
    return this.availabilitiesService.create(createAvailabilityDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.CUSTOMER, UserRole.PAINTER)
  findAll(@Req() req) {
    return this.availabilitiesService.findAll(req.user.role, req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.CUSTOMER, UserRole.PAINTER)
  findOne(@Param('id') id: string) {
    return this.availabilitiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PAINTER)
  update(@Param('id') id: string, @Body() updateAvailabilityDto: UpdateAvailabilityDto, @Req() req) {
    return this.availabilitiesService.update(id, updateAvailabilityDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.PAINTER)
  remove(@Param('id') id: string, @Req() req) {
    return this.availabilitiesService.remove(id, req.user.id);
  }
}
