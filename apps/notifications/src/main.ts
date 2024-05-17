import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
	const app = await NestFactory.create(NotificationsModule);
	const configService = app.get(ConfigService);
	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: configService.getOrThrow('NOTIFICATION_HOST'),
			port: configService.getOrThrow('NOTIFICATION_TCP_PORT')
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
