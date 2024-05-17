import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';

@Module({
	imports: [
		AppConfigModule,
		AppLoggerModule
	],
	controllers: [NotificationsController],
	providers: [NotificationsService]
})
export class NotificationsModule {
}
