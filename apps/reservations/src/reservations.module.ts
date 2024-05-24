import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { ReservationsRepository } from './reservations.repository';
import { ReservationEntity } from './entities/reservation.entity';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { HealthModule } from '@app/common/health/health.module';
import { PAYMENTS_PACKAGE_NAME } from '@app/common/proto/payments';
import { AUTH_PACKAGE_NAME } from '@app/common/proto/auth';
import { join } from 'path';

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
				name: AUTH_PACKAGE_NAME,
				useFactory: (cs: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: AUTH_PACKAGE_NAME,
						protoPath: join(__dirname, '../../../../proto/auth.proto'),
						url: cs.getOrThrow('AUTH_GRPC_URL')
					}
				}),
				inject: [ConfigService]
			},
			{
				name: PAYMENTS_PACKAGE_NAME,
				useFactory: (cs: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: PAYMENTS_PACKAGE_NAME,
						protoPath: join(__dirname, '../../../../proto/payments.proto'),
						url: cs.getOrThrow('PAYMENTS_GRPC_URL')
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
