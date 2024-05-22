import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '@app/common/entities/user.entity';
import { RoleEntity } from '@app/common/entities/role.entity';

@Injectable()
export class UsersService {

	constructor(private readonly userRepository: UserRepository) {
	}

	async create(createUserDto: CreateUserDto) {

		const existingUser = await this.findByEmail(createUserDto.email);
		if (existingUser) {
			throw new BadRequestException('User already exists');
		}

		const user = new UserEntity({
			...createUserDto,
			password: await bcrypt.hash(createUserDto.password, 10),
			roles: createUserDto.roles ? createUserDto.roles.map(
				(role) => new RoleEntity(role)
			) : []
		});
		try {
			return await this.userRepository.create(user);
		} catch (error) {
			throw new BadRequestException('Can\'t create the user');
		}
	}

	async findByEmail(email: string) {
		try {
			return await this.userRepository.findOne({
				email: email
			});
		} catch (error) {
			// no user
			return null;
		}
	}


	findAll() {
		return this.userRepository.find({});
	}

	findOne(id: string) {
		return this.userRepository.findOne({
			_id: id
		});
	}

	update(id: string, updateUserDto: UpdateUserDto) {
		return this.userRepository.findOneAndUpdate({
			_id: id
		},
		updateUserDto
		);

	}

	remove(id: string) {
		return this.userRepository.findOneAndDelete({
			_id: id
		});
	}

	async validateUser(email: string, password: string) {
		const user = await this.userRepository.findOne({
			email: email
		});

		if (user && await bcrypt.compare(password, user.password)) {
			return user;
		}
		throw new UnauthorizedException('Invalid credentials');
	}
}
