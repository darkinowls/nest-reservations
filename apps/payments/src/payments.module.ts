import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common/proto/notifications';
import { join } from 'path';

@Module({
	imports: [
		AppConfigModule,
		AppLoggerModule,
		ClientsModule.registerAsync([
			{
				name: NOTIFICATIONS_PACKAGE_NAME,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: NOTIFICATIONS_PACKAGE_NAME,
						protoPath: join(__dirname, '../../../../proto/notifications.proto'),
						url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL')
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
