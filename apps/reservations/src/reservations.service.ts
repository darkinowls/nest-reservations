import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { CREATE_CHARGE_MESSAGE, PAYMENT_SERVICE } from '@app/common/consts';
import { ClientProxy } from '@nestjs/microservices';
import { PurchaseUnitRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable()
export class ReservationsService {


	constructor(
		private readonly reservationsRepository: ReservationsRepository,
		@Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy
	) {
	}

	async create(createReservationDto: CreateReservationDto, userId: string) {
		const paymentInfo: PurchaseUnitRequest = {
			amount: {
				value: '100.00',
				currency_code: 'USD'
			}
		};
		// TODO: USE WEBHOOKS
		// TODO: add HTTPS
		return this.paymentClient
			.send(CREATE_CHARGE_MESSAGE, {})
			.pipe(
				map(
					async (value: string) => {
						const resDoc = await this.reservationsRepository.create({
							...createReservationDto,
							userId
						});
						return {
							...resDoc,
							approvalLink: value
						};
					}
				),
				catchError(err => {
					throw new BadRequestException(err.message);
				}
				)
			);
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
