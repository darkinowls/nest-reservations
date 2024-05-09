import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

	constructor(private readonly userRepository: UserRepository) {
	}

	async create(createUserDto: CreateUserDto) {
		try {
			return await this.userRepository.create({
				...createUserDto,
				password: await bcrypt.hash(createUserDto.password, 10)
			});
		} catch (error) {
			throw new BadRequestException('Can\'t create the user');
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
