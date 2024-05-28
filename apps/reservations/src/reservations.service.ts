import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CREATE_CHARGE_MESSAGE, PAYMENT_SERVICE } from '@app/common/consts';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

import { MakePaymentDto } from '@app/common/dto/makePayment.dto';
import { UserEntity } from '@app/common/entities/user.entity';
import { ReservationWithLinkDto } from './dto/reservation-with-link.dto';
import { PrismaService } from './prisma.service';
import { Reservation } from '.prisma/client';

@Injectable()
export class ReservationsService {


	constructor(
		private readonly prismaService: PrismaService,
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
					async (value): Promise<ReservationWithLinkDto> => {
						const resDoc = await this
							.prismaService.reservation.create(
								{
									data: {
										userId: user.id,
										endDate: createReservationDto.endDate,
										startDate: createReservationDto.startDate,
										invoiceId: createReservationDto.invoiceId
									}
								}
							);
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
		return this.prismaService.reservation.findMany();
	}

	findOne(id: string): Promise<Reservation> {
		return this.prismaService.reservation.findFirstOrThrow({
			where: {
				id
			}
		});
	}

	update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
		return this.prismaService.reservation.update(
			{
				where: {
					id
				},
				data: updateReservationDto
			}
		);
	}

	remove(id: string): Promise<Reservation> {
		return this.prismaService.reservation.delete({
			where: {
				id
			}
		});
	}

}
