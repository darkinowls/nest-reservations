import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument } from './entities/reservation.entity';
import { AppLoggerModule } from '@app/common/app-logger/app-logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/consts';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		AppLoggerModule,
		DatabaseModule,
		DatabaseModule.forFeature([
			ReservationDocument.definition
		]),
		ClientsModule.registerAsync([

			{
				name: AUTH_SERVICE,
				useFactory: (cs: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: cs.getOrThrow('AUTH_HOST'),
						port: cs.getOrThrow('AUTH_TCP_PORT'),
					},
				}),
				inject: [ConfigService],
			}


		])

	],
	controllers: [ReservationsController],
	providers: [ReservationsService, ReservationsRepository]
})
export class ReservationsModule {
}
