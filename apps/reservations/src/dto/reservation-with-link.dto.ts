import { IsString } from 'class-validator';
import { Reservation } from '.prisma/client';


export class ReservationWithLinkDto implements Reservation {
	@IsString()
		approvalLink: string;
	createdAt: Date;
	endDate: Date;
	id: string;
	invoiceId: string;
	startDate: Date;
	updatedAt: Date;
	userId: string;

}