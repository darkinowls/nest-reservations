import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { ReservationsRepository } from './reservations.repository';
import { ReservationEntity } from './entities/reservation.entity';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENT_SERVICE } from '@app/common/consts';
import { ConfigService } from '@nestjs/config';
import { HealthModule } from '@app/common/health/health.module';

@Module({
	imports: [
		AppLoggerModule,
		DatabaseModule,
		HealthModule,
		DatabaseModule.forFeature([
			ReservationEntity
		]),
		ClientsModule.registerAsync([
			{
				name: AUTH_SERVICE,
				useFactory: (cs: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [cs.getOrThrow<string>('RABBITMQ_URL')],
						queue: AUTH_SERVICE
					}
				}),
				inject: [ConfigService]
			},
			{
				name: PAYMENT_SERVICE,
				useFactory: (cs: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [cs.getOrThrow<string>('RABBITMQ_URL')],
						queue: PAYMENT_SERVICE
					}
				}),
				inject: [ConfigService]
			}
		])

	],
	controllers: [ReservationsController],
	providers: [ReservationsService, ReservationsRepository]
})
export class ReservationsModule {
}
