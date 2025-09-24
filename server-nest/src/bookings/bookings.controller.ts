import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, UserRole } from '../auth/decorators/roles.decorator';
import { BookingStatus } from '../common/enums/booking-status.enum';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.CUSTOMER, UserRole.PAINTER)
  findAll(@Req() req) {
    return this.bookingsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @Roles(UserRole.CUSTOMER, UserRole.PAINTER)
  findOne(@Param('id') id: string, @Req() req) {
    return this.bookingsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles(UserRole.CUSTOMER, UserRole.PAINTER)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @Req() req) {
    return this.bookingsService.update(id, updateBookingDto, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @Roles(UserRole.PAINTER)
  updateStatus(@Param('id') id: string, @Body('status') status: BookingStatus, @Req() req) {
    return this.bookingsService.updateStatus(id, status, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.CUSTOMER, UserRole.PAINTER)
  remove(@Param('id') id: string, @Req() req) {
    return this.bookingsService.remove(id, req.user.id, req.user.role);
  }
}
