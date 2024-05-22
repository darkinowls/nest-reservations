import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { UserDto } from '@app/common/dto/user.dto';
import { Roles } from '@app/common/decorators/roles.decorator';

@Controller('reservations')
@ApiTags('reservations')
export class ReservationsController {
	constructor(private readonly reservationsService: ReservationsService) {
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(
		@Body() createReservationDto: CreateReservationDto,
		@GetUser() user: UserDto
	) {
		console.log(user);
		return this.reservationsService.create(createReservationDto, user);
	}

	@Get()
	findAll() {
		return this.reservationsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.reservationsService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
		return this.reservationsService.update(id, updateReservationDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@Roles('admin', 'owner')
	remove(@Param('id') id: string) {
		return this.reservationsService.remove(id);
	}
}
