import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateReservationDto {

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  // @IsUUID()
  @IsString()
  placeId: string;

  // @IsUUID()
  @IsString()
  invoiceId: string;


}
