import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { CREATE_CHARGE_MESSAGE, PAYMENT_SERVICE } from '@app/common/consts';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

import { MakePaymentDto } from '@app/common/dto/makePayment.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { UserEntity } from '@app/common/entities/user.entity';

@Injectable()
export class ReservationsService {


	constructor(
		private readonly reservationsRepository: ReservationsRepository,
		@Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy
	) {
	}

	async create(createReservationDto: CreateReservationDto, user: UserEntity) {
		const paymentInfo: MakePaymentDto = {
			email: user.email,
			purchaseUnitRequest: {
				amount: {
					value: '100.00',
					currency_code: 'USD'
				}
			}
		};
		// TODO: USE WEBHOOKS
		// TODO: add HTTPS
		return this.paymentClient
			.send(CREATE_CHARGE_MESSAGE, paymentInfo)
			.pipe(
				map(
					async (value: string) => {
						const res = new ReservationEntity({
							...createReservationDto,
							userId: user._id
						});
						const resDoc = await this
							.reservationsRepository.create(res);
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
