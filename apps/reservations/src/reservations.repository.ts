import { Injectable, Logger } from '@nestjs/common';
import { ReservationEntity } from './entities/reservation.entity';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReservationsRepository
	extends AbstractRepository<ReservationEntity> {

	logger = new Logger(ReservationsRepository.name);

	constructor(
		@InjectRepository(ReservationEntity) reservationRepository: Repository<ReservationEntity>,
			entityManager: EntityManager
	) {
		super(reservationRepository, entityManager);
	}


}