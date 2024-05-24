import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';
import { ResultPaymentDto } from './dto/resultPayment.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { MakePaymentDto } from '@app/common/dto/makePayment.dto';
import { NotifyUserDto } from '@app/common/dto/notifyUser.dto';
import {
	NOTIFICATIONS_PACKAGE_NAME,
	NOTIFICATIONS_SERVICE_NAME,
	NotificationsServiceClient
} from '@app/common/proto/notifications';


@Injectable()
export class PaymentsService implements OnModuleInit {

	logger = new Logger(PaymentsService.name);

	private readonly payClient: paypal.core.PayPalHttpClient;

	private notificationClient: NotificationsServiceClient;

	onModuleInit() {
		this.notificationClient = this.clientGrpc.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME);
	}

	constructor(
		private readonly configService: ConfigService,
		@Inject(NOTIFICATIONS_PACKAGE_NAME) private readonly clientGrpc: ClientGrpc
	) {
		const clientId = this.configService.getOrThrow('PAYMENT_CLIENT_ID');
		const clientSecret = this.configService.getOrThrow('PAYMENT_CLIENT_SECRET');
		//
		// // This sample uses SandboxEnvironment. In production, use LiveEnvironment
		const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
		this.payClient = new paypal.core.PayPalHttpClient(environment);
	}

	async createCharge(makePaymentDto: MakePaymentDto): Promise<string> {

		const { email, purchaseUnitRequest } = makePaymentDto;

		this.logger.debug(makePaymentDto);

		const r = new paypal.orders.OrdersCreateRequest();
		r.requestBody({
			intent: 'CAPTURE',
			purchase_units: [{
				amount: {
					currency_code: purchaseUnitRequest.amount.currencyCode,
					value: purchaseUnitRequest.amount.value
				},
			}]
		});

		const res = (await this.payClient.execute(r)).result as ResultPaymentDto;
		if (res.status !== 'CREATED') {
			throw new Error('Order not created');
		}

		const notifyUser: NotifyUserDto = {
			email: email,
			subject: 'Payment required',
			message: 'Make the payment, unless reservation will be undone'
		};

		if (this.configService.get('MOCK_NOTIFICATIONS') !== 'true') {
			this.notificationClient.notifyUser(notifyUser).subscribe();
		}
		this.logger.debug(res);
		return this.getApprovalLink(res);
	}

	private getApprovalLink(orderData: ResultPaymentDto): string {
		const approvalLink = orderData.links.find(link => link.rel === 'approve');
		if (!approvalLink) {
			throw new Error('No approval link found');
		}
		return approvalLink.href;
	}
}
