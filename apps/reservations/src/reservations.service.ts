import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {

	constructor(
		private readonly reservationsRepository: ReservationsRepository
	) {
	}

	create(createReservationDto: CreateReservationDto, userId: string) {
		return this.reservationsRepository.create({
			...createReservationDto,
			userId
		});
	}

	findAll() {
		return this.reservationsRepository.find({});
	}

	findOne(id: string) {
		return this.reservationsRepository.findOne({
			_id: id
		});
	}

	update(id: string, updateReservationDto: UpdateReservationDto) {
		return this.reservationsRepository.findOneAndUpdate(
			{ _id: id },
			updateReservationDto
		);
	}

	remove(id: string) {
		return this.reservationsRepository.findOneAndDelete({
			_id: id
		});
	}

}
