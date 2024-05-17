import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE } from '@app/common/consts';
import { ClientProxy } from '@nestjs/microservices';
import { PurchaseUnitRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';

@Injectable()
export class ReservationsService {



	constructor(
		private readonly reservationsRepository: ReservationsRepository,
		@Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy
	) {
	}

	async create(createReservationDto: CreateReservationDto, userId: string) {
		const res = await this.reservationsRepository.create({
			...createReservationDto,
			userId
		});
		const paymentInfo: PurchaseUnitRequest= {
			amount: {
				value: '100.00',
				currency_code: 'USD'
			}
		} 
		this.paymentClient.send('createCharge', paymentInfo);
		return res;
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
