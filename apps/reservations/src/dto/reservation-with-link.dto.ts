import { ReservationDocument } from '../entities/reservation.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReservationWithLinkDto extends ReservationDocument {
	@Field()
		approvalLink: string;
}