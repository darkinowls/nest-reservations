import { AbstractEntity } from '@app/common/database/abstract.entity';
import { Column } from 'typeorm';

export class RoleEntity extends AbstractEntity<RoleEntity> {
	@Column({
		unique: true
	})
		name: string;
}