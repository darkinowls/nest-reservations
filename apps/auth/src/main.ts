import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from '@app/common/consts';

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	const configService = app.get(ConfigService);
	app.connectMicroservice({
		transport: Transport.RMQ,
		options: {
			urls: [configService.getOrThrow('RABBITMQ_URL')],
			queue: AUTH_SERVICE,
		}


	});

	app.use(
		cookieParser()
	);

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

	const config = new DocumentBuilder()
		.setTitle('Reservations api')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.startAllMicroservices();
	await app.listen( configService.getOrThrow('AUTH_HTTP_PORT'));
}

bootstrap();
