import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
	imports: [TypeOrmModule.forRootAsync({
		useFactory: (cs: ConfigService) => ({
			type: 'postgres',
			host: cs.get('POSTGRES_HOST'),
			port: cs.get('POSTGRES_PORT'),
			username: cs.get('POSTGRES_USER'),
			password: cs.get('POSTGRES_PASSWORD'),
			database: cs.get('POSTGRES_DB'),
			synchronize: cs.getOrThrow('SYNC_DB') === 'true',
			autoLoadEntities: true

		}),
		inject: [ConfigService],
		imports: [AppConfigModule]
	})],
	controllers: [],
	providers: [],
	exports: []
})
export class DatabaseModule {

	static forFeature(models: EntityClassOrSchema[]) {
		return TypeOrmModule.forFeature(models);
	}

}
