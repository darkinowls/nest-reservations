import { Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { DatabaseModule } from "@app/common/database/database.module";
import { ReservationsRepository } from "./reservations.repository";
import { ReservationDocument } from "./entities/reservation.entity";
import { AppLoggerModule } from "@app/common/app-logger/app-logger.module";

@Module({
  imports: [
    AppLoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      ReservationDocument.definition
    ])],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository]
})
export class ReservationsModule {
}
