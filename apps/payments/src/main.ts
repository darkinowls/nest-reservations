import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
	const app = await NestFactory.create(PaymentsModule);
	const configService = app.get(ConfigService);
	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: '0.0.0.0',
			port: configService.getOrThrow('PAYMENT_TCP_PORT')
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
	await app.listen(3020);
}

bootstrap();
