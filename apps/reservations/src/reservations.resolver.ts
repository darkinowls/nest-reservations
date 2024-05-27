import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationDocument } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UserDto } from '@app/common/dto/user.dto';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { ReservationWithLinkDto } from './dto/reservation-with-link.dto';

@Resolver(() => ReservationDocument)
export class ReservationsResolver {

	constructor(private readonly reservationsService: ReservationsService) {

	}

	@Mutation(() => ReservationWithLinkDto)
	createReservation(
		@Args('createReservationDto') createReservationDto: CreateReservationDto,
		@GetUser() user: UserDto
	) {
		return this.reservationsService.create(createReservationDto, user);
	}

	@Query(() => [ReservationDocument], { name: 'reservations' })
	getReservations() {
		return this.reservationsService.findAll();
	}

	@Query(() => ReservationDocument, { name: 'reservation' })
	getReservation(@Args('id', {
		type: () => String
	}) id: string) {
		return this.reservationsService.findOne(id);
	}

	@Mutation(() => ReservationDocument)
	removeReservation(@Args('id', {
		type: () => String
	}) id: string) {
		return this.reservationsService.remove(id);
	}

	@Mutation(() => ReservationDocument)
	updateReservation(
		@Args('id', {
			type: () => String
		}) id: string,
		@Args('updateReservationDto') updateReservationDto: CreateReservationDto
	) {
		return this.reservationsService.update(id, updateReservationDto);
	}

}