import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => UserDocument)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {
	}

	@Query(() => [UserDocument])
	async users() {
		return this.usersService.findAll();
	}

	@Mutation(() => UserDocument)
	async createUser(@Args('input') input: CreateUserDto) {
		return this.usersService.create(input);
	}


}