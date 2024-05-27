import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(GatewayModule);
	const configService = app.get(ConfigService);
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

	await app.listen(configService.getOrThrow('AUTH_HTTP_PORT'));

}

bootstrap();
