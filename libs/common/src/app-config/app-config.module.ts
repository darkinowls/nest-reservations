import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi  from 'joi';

@Module({
	imports: [ConfigModule.forRoot({
		isGlobal: true,
		validationSchema: Joi.object({
		//   MONGO_URI: Joi.string().required(),
		//   JWT_SECRET: Joi.string().required(),
		//   JWT_EXPIRE: Joi.string().required(),
		}),
		// cache: true,
	})],
	providers: [ConfigService],
	exports: [ConfigService]
})
export class AppConfigModule {
}
