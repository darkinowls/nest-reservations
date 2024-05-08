import { Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationsRepository } from "./reservations.repository";

@Injectable()
export class ReservationsService {

  constructor(
    private readonly reservationsRepository: ReservationsRepository
  ) {
  }

  create(createReservationDto: CreateReservationDto) {
    return this.reservationsRepository.create({
      ...createReservationDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "1"
    });
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne({
      _id: id
    });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id: id },
      {
        ...updateReservationDto,
        updatedAt: new Date()
      }
    );
  }

  remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({
      _id: id
    });
  }

}
