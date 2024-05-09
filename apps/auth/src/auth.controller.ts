import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { UserDocument } from './users/entities/user.entity';
import { Request, Response } from 'express';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@UseGuards(AuthGuard('local'))
	@Post('local')
	async login(
		@GetUser() user: UserDocument,
		@Res({ passthrough: true }) response: Response,
		@Body() createUserDto: CreateUserDto) {
		const resUser = await this.authService.login(user, response);
		response.send(user);
	}


	@Get('me')
	@UseGuards(JwtAuthGuard)
	async me(@GetUser() user: UserDocument) {
		return user;
	}

}
