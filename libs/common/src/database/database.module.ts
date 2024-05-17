import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [MongooseModule.forRootAsync({
		useFactory: async (cs: ConfigService) => ({
			uri: cs.getOrThrow('MONGO_URI')
		}),
		inject: [ConfigService],
		imports: [AppConfigModule]
	})],
	controllers: [],
	providers: [],
	exports: []
})
export class DatabaseModule {

	static forFeature(models: ModelDefinition[]) {
		return MongooseModule.forFeature(models);
	}

}
