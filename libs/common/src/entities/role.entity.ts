import { AbstractEntity } from '@app/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class RoleEntity extends AbstractEntity<RoleEntity> {
	@Column({
		unique: true
	})
		name: string;
}