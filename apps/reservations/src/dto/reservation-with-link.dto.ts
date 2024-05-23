import { CreateReservationDto } from './create-reservation.dto';
import { IsString } from 'class-validator';
import { ReservationEntity } from '../entities/reservation.entity';

export class ReservationWithLinkDto extends ReservationEntity{
	@IsString()
		approvalLink: string;
}