import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export abstract class AbstractEntity<T> {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@CreateDateColumn()
		createdAt: Date;

	@UpdateDateColumn()
		updatedAt: Date;

	constructor(entity: Partial<T>) {
		Object.assign(this, entity);
	}



}

