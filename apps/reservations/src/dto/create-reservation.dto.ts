import { IsDate, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationDto {

	@IsDate()
	@Field()
		startDate: Date;

	@IsDate()
	@Field()
		endDate: Date;

	// @IsUUID()
	@IsString()
	@Field()
		placeId: string;

	// @IsUUID()
	@IsString()
	@Field()
		invoiceId: string;


}
