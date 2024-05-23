import { AbstractEntity } from '@app/common/database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity()
export class UserEntity extends AbstractEntity<UserEntity> {

	@Column({
		unique: true,
	})
		email: string;

	@Column()
		password: string;

	@ManyToMany(() => RoleEntity, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinTable()
		roles: RoleEntity[];
}


