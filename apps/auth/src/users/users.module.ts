import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/common/database/database.module';


import { UserRepository } from './user.repository';
import { UserEntity } from '@app/common/entities/user.entity';
import { RoleEntity } from '@app/common/entities/role.entity';

@Module({
	controllers: [UsersController],
	providers: [UsersService, UserRepository],
	imports: [
		DatabaseModule,
		DatabaseModule.forFeature([
			UserEntity, RoleEntity
		])
	],
	exports: [UsersService]
})
export class UsersModule {
}
