import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RpcException } from '@nestjs/microservices';
import { AmountDto, MakePaymentDto, PurchaseUnitRequestDto } from '@app/common/dto/makePayment.dto';
import { LinkMessage, PaymentsServiceController, PaymentsServiceControllerMethods } from '@app/common/proto/payments';


@Controller()
@PaymentsServiceControllerMethods()
export class PaymentsController implements PaymentsServiceController {
	constructor(private readonly paymentsService: PaymentsService) {
	}

	@Get()
	async getHello(): Promise<string> {
		const amount: AmountDto = new AmountDto('100', 'USD');
		return this.paymentsService.createCharge({
			email: 'user@example.com',
			purchaseUnitRequest: new PurchaseUnitRequestDto(amount, 'Reservation')
		});
	}

	// @MessagePattern(CREATE_CHARGE_MESSAGE)
	async payForReservation(
		data: MakePaymentDto
	): Promise<LinkMessage> {
		try {
			// console.log(data);
			return {
				link: await this.paymentsService.createCharge(data)
			};
		} catch (e) {
			throw new RpcException('Payment data is invalid');
		}
	}


}
