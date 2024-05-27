import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
	imports: [
		AppConfigModule,
		AppLoggerModule,
		GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
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
