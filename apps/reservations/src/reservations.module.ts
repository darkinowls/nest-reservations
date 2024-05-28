import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENT_SERVICE } from '@app/common/consts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from '@app/common/health/health.module';
import { PrismaService } from './prisma.service';
import { AppConfigModule } from '@app/common/app-config/app-config.module';

@Module({
	imports: [
		AppLoggerModule,
		HealthModule,
		AppConfigModule,
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
			},
			{
				name: PAYMENT_SERVICE,
				useFactory: (cs: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: cs.getOrThrow('PAYMENT_HOST'),
						port: cs.getOrThrow('PAYMENT_TCP_PORT')
					}
				}),
				inject: [ConfigService]
			}
		])

	],
	controllers: [ReservationsController],
	providers: [ReservationsService, PrismaService]
})
export class ReservationsModule {
}
