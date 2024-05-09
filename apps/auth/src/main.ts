import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import * as process from 'process';

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);

	app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: '0.0.0.0',
			port: process.env.AUTH_TCP_PORT || -1
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
	await app.listen(process.env.AUTH_HTTP_PORT || -1);
}

bootstrap();
