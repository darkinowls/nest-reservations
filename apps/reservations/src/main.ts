import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
	const app: NestExpressApplication = await NestFactory.create(ReservationsModule);
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
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.RESERVATION_PORT || -1);
}

bootstrap();
