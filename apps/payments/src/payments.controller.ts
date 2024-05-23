import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Ctx, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { CREATE_CHARGE_MESSAGE } from '@app/common/consts';
import { MakePaymentDto } from '@app/common/dto/makePayment.dto';


@Controller()
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {
	}

	@Get()
	async getHello(): Promise<string> {
		return this.paymentsService.createCharge({
			email: 'user@example.com',
			purchaseUnitRequest: {
				amount: {
					value: '100',
					currency_code: 'USD'
				},
				description: 'Test charge'
			}
		});
	}

	@MessagePattern(CREATE_CHARGE_MESSAGE)
	async payForReservation(
		@Payload() data: MakePaymentDto,
		@Ctx() context: RmqContext
	) {
		await this.doManualAck(context);
		try {
			// console.log(data);
			return await this.paymentsService.createCharge(data);
		} catch (e) {
			throw new RpcException('Payment data is invalid');
		}
	}

	private async doManualAck(context: RmqContext) {
		try {
			throw new Error('Method not implemented.');
		} catch (e) {
			await new Promise((resolve) => {
				setTimeout(resolve, 10000);
			});
			const channel = context.getChannelRef();
			const originalMsg = context.getMessage();
			channel.ack(originalMsg);
		}
	}

}
