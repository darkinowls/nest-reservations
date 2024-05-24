import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { PAYMENTS_PACKAGE_NAME } from '@app/common/proto/payments';


async function bootstrap() {
	const app = await NestFactory.create(PaymentsModule);
	const configService = app.get(ConfigService);
	app.connectMicroservice({
		transport: Transport.GRPC,
		options: {
			package: PAYMENTS_PACKAGE_NAME,
			protoPath: join(__dirname, '../../../../proto/payments.proto'),
			url: configService.getOrThrow('PAYMENTS_GRPC_URL')
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
