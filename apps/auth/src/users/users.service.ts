import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './prisma.service';
import { User } from '.prisma/client';

@Injectable()
export class UsersService {

	constructor(private readonly prismaService: PrismaService) {
	}

	async create(createUserDto: CreateUserDto): Promise<User> {

		const existingUser = await this.findByEmail(createUserDto.email);
		if (existingUser) {
			throw new BadRequestException('User already exists');
		}

		try {
			return await this.prismaService.user.create({
				data: {
					...createUserDto,
					password: await bcrypt.hash(createUserDto.password, 10),
					roles: createUserDto.roles ? createUserDto.roles.map(
						(role) => role.name
					) : []
				}
			});
		} catch (error) {
			console.log(error);
			throw new BadRequestException('Can\'t create the user');
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		try {
			return await this.prismaService.user.findFirstOrThrow({
				where: {
					email
				}
			});
		} catch (error) {
			// no user
			return null;
		}
	}


	async findAll(): Promise<User[]> {
		return await this.prismaService.user.findMany();
	}

	async findOne(id: string): Promise<User> {
		return await this.prismaService.user.findUniqueOrThrow({
			where: {
				id
			}
		});
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user: User | null = await this.findByEmail(email);

		if (user && await bcrypt.compare(password, user.password)) {
			return user;
		}
		throw new UnauthorizedException('Invalid credentials');
	}
}
