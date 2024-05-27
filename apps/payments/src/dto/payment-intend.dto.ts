import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentIntendDto{
	id: string;
	amount: string;
	currency: string;
	description: string;
}