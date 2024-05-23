import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE, PAYMENT_SERVICE } from '@app/common/consts';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		AppConfigModule,
		AppLoggerModule,
		ClientsModule.registerAsync([
			{
				name: NOTIFICATION_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
						queue: PAYMENT_SERVICE
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	controllers: [PaymentsController],
	providers: [PaymentsService]
})
export class PaymentsModule {
}
