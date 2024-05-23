import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { PAYMENT_SERVICE } from '@app/common/consts';


async function bootstrap() {
	const app = await NestFactory.create(PaymentsModule);
	const configService = app.get(ConfigService);
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RABBITMQ_URL')],
			noAck: false,
			queue: PAYMENT_SERVICE
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
	await app.listen(configService.getOrThrow('PAYMENT_HTTP_PORT'));
}

bootstrap();
