import { Injectable, Logger } from "@nestjs/common";
import { ReservationDocument } from "./entities/reservation.entity";
import { AbstractRepository } from "@app/common/database/abstract.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ReservationsRepository
  extends AbstractRepository<ReservationDocument> {

  logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectModel(ReservationDocument.name) reservationModel: Model<ReservationDocument>
  ) {
    super(reservationModel);
  }


}