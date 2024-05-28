import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_MESSAGE } from '@app/common/consts';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { LoginUserDto } from './users/dto/login-user.dto';
import { UserEntity } from '@app/common/entities/user.entity';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
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


	@MessagePattern(AUTH_MESSAGE)
	@UseGuards(JwtAuthGuard)
	async auth(
		@Payload() data
	) {
		console.log(data);
		const user: UserEntity = data.user;
		return user;
	}

}
