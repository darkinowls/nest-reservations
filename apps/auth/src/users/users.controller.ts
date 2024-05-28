import {
	Controller,
	Get,
	Post,
	Body
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '.prisma/client';

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {
	}

	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return await this.usersService.create(createUserDto);
	}

	@Get()
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	// 	return this.usersService.findOne(id);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
	// 	return this.usersService.update(id, updateUserDto);
	// }
	//
	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.usersService.remove(id);
	// }
}
