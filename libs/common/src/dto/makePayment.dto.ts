import { AmountWithBreakdown, PurchaseUnitRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';
import { AmountMessage, MakePaymentMessage, PurchaseUnitRequestMessage } from '@app/common/proto/payments';

export class MakePaymentDto implements MakePaymentMessage {
	email: string;
	purchaseUnitRequest: PurchaseUnitRequestDto;
}

export class PurchaseUnitRequestDto implements PurchaseUnitRequest, PurchaseUnitRequestMessage {
	constructor(
		public readonly amount: AmountDto,
		public readonly description?: string
	) {

	}

}

export class AmountDto implements AmountMessage, AmountWithBreakdown {
	public readonly currency_code: string;

	constructor(
		public value: string,
		public currencyCode: string
	) {
		this.currency_code = currencyCode;
	}


}
