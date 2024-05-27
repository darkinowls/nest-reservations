import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/common/app-config/app-config.module';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/consts';
import { authContext } from './auth.context';

@Module({
	imports: [
		AppConfigModule,
		AppLoggerModule,
		ClientsModule.registerAsync([
			{
				name: AUTH_SERVICE,
				useFactory: (cs: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: cs.getOrThrow('AUTH_HOST'),
						port: cs.getOrThrow('AUTH_TCP_PORT')
					}
				}),
				inject: [ConfigService]
			}
			// {
			// 	name: 'reservations',
			// 	useFactory: (cs: ConfigService) => ({
			// 		transport: Transport.TCP,
			// 		options: {
			// 			host: cs.getOrThrow('AUTH_HOST'),
			// 			port: cs.getOrThrow('AUTH_TCP_PORT')
			// 		}
			// 	}),
			// 	inject: [ConfigService]
			// }
		]),
		GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
			driver: ApolloGatewayDriver,
			useFactory: (cs: ConfigService) => ({
				server: {
					// get token with each reqeust
					context: authContext
				},
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
					}),
					buildService({ url }) {
						return new RemoteGraphQLDataSource({
							url,
							// resends the user object to the subgraph
							willSendRequest({ request, context }: { request: any, context: Record<string, any> }) {
								request.http.headers.set(
									'user', context.user ? JSON.stringify(context.user) : null
								);
							}
						});
					}
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
