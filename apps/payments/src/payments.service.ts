import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';
import { PurchaseUnitRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';
import { ResultPaymentDto } from './dto/resultPayment.dto';


@Injectable()
export class PaymentsService {

	logger = new Logger(PaymentsService.name);

	private readonly payClient: paypal.core.PayPalHttpClient;


	constructor(readonly configService: ConfigService) {
		const clientId = this.configService.getOrThrow('PAYMENT_CLIENT_ID');
		const clientSecret = this.configService.getOrThrow('PAYMENT_CLIENT_SECRET');
		//
		// // This sample uses SandboxEnvironment. In production, use LiveEnvironment
		const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
		this.payClient = new paypal.core.PayPalHttpClient(environment);
	}

	async createCharge(ccd: PurchaseUnitRequest): Promise<string> {

		const r = new paypal.orders.OrdersCreateRequest();
		r.requestBody({
			intent: 'CAPTURE',
			purchase_units: [ccd]
		});

		const res = (await this.payClient.execute(r)).result as ResultPaymentDto;
		if (res.status !== 'CREATED') {
			throw new Error('Order not created');
		}
		console.log(res);
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
