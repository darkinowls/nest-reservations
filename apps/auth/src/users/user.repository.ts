import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '@app/common/entities/user.entity';


export class UserRepository extends AbstractRepository<UserEntity> {
	logger = new Logger(UserRepository.name);

	constructor(
		@InjectRepository(UserEntity) repo: Repository<UserEntity>,
			manager: EntityManager
	) {
		super(repo, manager);
	}
}