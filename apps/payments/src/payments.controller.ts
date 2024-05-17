import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CREATE_CHARGE_MESSAGE } from '@app/common/consts';
import { PurchaseUnitRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';

@Controller()
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {
	}

	@Get()
	async getHello(): Promise<string> {
		return this.paymentsService.createCharge({
			amount: {
				value: '100',
				currency_code: 'USD'
			},
			description: 'Test charge'
		});
	}

	@MessagePattern(CREATE_CHARGE_MESSAGE)
	async payForReservation(
		@Payload() data: PurchaseUnitRequest
	) {
		console.log(data);
		return this.paymentsService.createCharge(data);
	}
}
