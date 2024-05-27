import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloGatewayDriver } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
	imports: [
		AppConfigModule,
		AppLoggerModule,
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloGatewayDriver,
			useFactory: (cs: ConfigService) => ({
				gateway: {
					supergraphSdl: new IntrospectAndCompose({
						subgraphs: [
							{
								name: 'auth',
								url: cs.getOrThrow('AUTH_GQL_URL')
							},
							{
								name: 'reservations',
								url: cs.getOrThrow('RESERVATIONS_GQL_URL')
							}
						]
					})
				},
				autoSchemaFile: true,
				introspection: true,
				playground: true
			}),
			inject: [ConfigService]
		})
	],
	controllers: [],
	providers: []
})
export class GatewayModule {
}
