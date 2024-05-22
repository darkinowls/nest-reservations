import { AbstractEntity } from '@app/common/database/abstract.entity';
import { Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<TEntity extends AbstractEntity<TEntity>> {

	protected abstract readonly logger: Logger;

	constructor(
		private readonly entityRepository: Repository<TEntity>,
		private readonly entityManager: EntityManager
	) {
	}

	async create(entity: TEntity): Promise<TEntity> {
		return await this.entityRepository.save(entity);
	}

	async findOne(where: FindOptionsWhere<TEntity>): Promise<TEntity> {
		const entity = await this.entityRepository.findOne({
			where
		});

		if (!entity) {
			this.logger.warn(`entity not found with filter: ${JSON.stringify(where)}`);
			throw new NotFoundException(`entity not found with filter: ${JSON.stringify(where)}`);
		}

		this.logger.debug(`Found entity: ${JSON.stringify(entity)}`);
		return entity;
	}

	async findOneAndUpdate(
		where: FindOptionsWhere<TEntity>,
		update: QueryDeepPartialEntity<TEntity>
	): Promise<TEntity> {
		const updateResult: UpdateResult = await this.entityRepository.update(where, update);

		if (!updateResult.affected) {
			this.logger.warn(`entity not found with filter: ${JSON.stringify(where)}`);
			throw new NotFoundException(`entity not found with filter: ${JSON.stringify(where)}`);
		}

		const entity = await this.findOne(where);

		this.logger.debug(`Updated entity: ${JSON.stringify(entity)}`);
		return entity;
	}

	async find(where: FindOptionsWhere<TEntity>): Promise<TEntity[]> {
		const entities = await this.entityRepository.find({
			where
		});
		this.logger.debug(`Found entitys: ${JSON.stringify(entities)}`);
		return entities;
	}

	async findOneAndDelete(where: FindOptionsWhere<TEntity>) {
		const doc = await this.entityRepository.delete(
			where
		);
		if (!doc.affected) {
			this.logger.warn(`entity not found with filter: ${JSON.stringify(where)}`);
			throw new NotFoundException(`entity not found with filter: ${JSON.stringify(where)}`);
		}
	}

}