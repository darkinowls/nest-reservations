import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { LoginUserDto } from './users/dto/login-user.dto';
import { UserEntity } from '@app/common/entities/user.entity';
import {
	AuthServiceController,
	AuthServiceControllerMethods,
	UserMessage
} from '@app/common/proto/auth';
import { Timestamp } from '../../../google/protobuf/timestamp';
import { DateConverter } from '@app/common/converters/date.converter';


@Controller('auth')
@ApiTags('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
	constructor(private readonly authService: AuthService) {
	}

	@UseGuards(AuthGuard('local'))
	@Post('local')
	async login(
		@GetUser() user: UserEntity,
		@Res({ passthrough: true }) response: Response,
		@Body() _: LoginUserDto) {
		await this.authService.login(user, response);
		response.send(user);
	}


	@Get('me')
	@UseGuards(JwtAuthGuard)
	async me(@GetUser() user: UserEntity) {
		return user;
	}


	@UseGuards(JwtAuthGuard)
	async auth(
		data: any
	): Promise<UserMessage> {
		console.log(data);
		const user: UserEntity = data.user;
		console.log(user);
		return {
			email: user.email,
			password: user.password,
			createdAt: DateConverter.toTimeStamp(user.createdAt),
			updatedAt: DateConverter.toTimeStamp(user.updatedAt),
			id: user.id,
			roles: user.roles.map(role => role.name)
		};
	}

}
