import { PurchaseUnitRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';

export interface MakePaymentDto{
	email: string;
	purchaseUnitRequest: PurchaseUnitRequest
}