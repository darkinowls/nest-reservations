import * as paypal from '@paypal/checkout-server-sdk';

export interface ResultPaymentDto {
	id: string,
	status: paypal.payments.Status,
	links: {
		href: string;
		rel: string;
		method: string
	}[];
}