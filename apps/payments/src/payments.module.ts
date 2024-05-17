import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';

@Module({
	imports: [
		AppConfigModule,
		AppLoggerModule
	],
	controllers: [PaymentsController],
	providers: [PaymentsService]
})
export class PaymentsModule {
}
