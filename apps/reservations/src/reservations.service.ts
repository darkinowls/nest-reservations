import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

import { AmountDto, MakePaymentDto, PurchaseUnitRequestDto } from '@app/common/dto/makePayment.dto';
import { ReservationEntity } from './entities/reservation.entity';
import { UserEntity } from '@app/common/entities/user.entity';
import { ReservationWithLinkDto } from './dto/reservation-with-link.dto';
import {
	LinkMessage,
	PAYMENTS_PACKAGE_NAME,
	PAYMENTS_SERVICE_NAME,
	PaymentsServiceClient
} from '@app/common/proto/payments';

@Injectable()
export class ReservationsService implements OnModuleInit {

	private paymentService: PaymentsServiceClient;

	constructor(
		private readonly reservationsRepository: ReservationsRepository,
		@Inject(PAYMENTS_PACKAGE_NAME) private readonly paymentsPackage: ClientGrpc
	) {
	}

	onModuleInit() {
		this.paymentService = this.paymentsPackage.getService<PaymentsServiceClient>(PAYMENTS_SERVICE_NAME);
	}

	async create(createReservationDto: CreateReservationDto, user: UserEntity) {
		const amount = new AmountDto('100.00', 'USD');
		console.log('INSIDE CREATE');
		console.log(user);
		const paymentInfo: MakePaymentDto = {
			email: user.email,
			purchaseUnitRequest: new PurchaseUnitRequestDto(amount, 'Reservation')
		};
		// TODO: USE WEBHOOKS
		// TODO: add HTTPS
		return this.paymentService.payForReservation(
			paymentInfo
		)
			.pipe(
				map(
					async (value: LinkMessage): Promise<ReservationWithLinkDto> => {
						console.log('INSIDE MAP');
						console.log(user);
						const res = new ReservationEntity({
							...createReservationDto,
							userId: user.id
						});
						const resDoc = await this
							.reservationsRepository.create(res);
						return {
							...resDoc,
							approvalLink: value.link
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
			where: { id }
		});
	}

	update(id: string, updateReservationDto: UpdateReservationDto) {
		return this.reservationsRepository.findOneAndUpdate(
			{ id },
			updateReservationDto
		);
	}

	remove(id: string) {
		return this.reservationsRepository.findOneAndDelete({
			id
		});
	}

}
