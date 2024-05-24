// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.0
//   protoc               v5.26.1
// source: proto/payments.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "payments";

export interface MakePaymentMessage {
  email: string;
  purchaseUnitRequest: PurchaseUnitRequestMessage | undefined;
}

export interface PurchaseUnitRequestMessage {
  amount: AmountMessage | undefined;
}

export interface AmountMessage {
  value: string;
  currencyCode: string;
}

export interface LinkMessage {
  /** dones't support _id */
  link: string;
}

export const PAYMENTS_PACKAGE_NAME = "payments";

export interface PaymentsServiceClient {
  payForReservation(request: MakePaymentMessage): Observable<LinkMessage>;
}

export interface PaymentsServiceController {
  payForReservation(request: MakePaymentMessage): Promise<LinkMessage> | Observable<LinkMessage> | LinkMessage;
}

export function PaymentsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["payForReservation"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PaymentsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PaymentsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PAYMENTS_SERVICE_NAME = "PaymentsService";
