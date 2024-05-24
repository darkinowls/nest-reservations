import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';
import { join } from 'path';
import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common/proto/notifications';

async function bootstrap() {
	const app = await NestFactory.create(NotificationsModule);
	const configService = app.get(ConfigService);
	app.connectMicroservice({
		transport: Transport.GRPC,
		options: {
			package: NOTIFICATIONS_PACKAGE_NAME,
			protoPath: join(__dirname, '../../../../proto/notifications.proto'),
			url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL')
		}
	});
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true
			}
		})
	);
	app.useLogger(
		app.get(Logger)
	);
	await app.startAllMicroservices();
	await app.listen(configService.getOrThrow('NOTIFICATION_HTTP_PORT'));
}

bootstrap();
