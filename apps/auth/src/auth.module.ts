import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { UsersModule } from './users/users.module';
import { AuthService } from './auth.service';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HealthModule } from '@app/common/health/health.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig, ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { AuthResolver } from './auth.resolver';


@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtService, LocalStrategy, JwtStrategy, AuthResolver],
	imports: [
		UsersModule,
		AppLoggerModule,
		HealthModule,
		GraphQLModule.forRoot<ApolloFederationDriverConfig>({
			driver: ApolloFederationDriver,
			autoSchemaFile: {
				federation: 2
			}
		}),
		AppConfigModule,
		JwtModule.registerAsync({
			useFactory: (cs: ConfigService) => ({
				secret: cs.getOrThrow('JWT_SECRET'),
				signOptions: { expiresIn: cs.getOrThrow('JWT_EXPIRE') }
			}),
			inject: [ConfigService],
			imports: [AppConfigModule]
		})
	]
})
export class AuthModule {
}
