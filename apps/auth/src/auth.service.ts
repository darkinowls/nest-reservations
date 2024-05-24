import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { UserEntity } from '@app/common/entities/user.entity';

@Injectable()
export class AuthService {

	constructor(
		private readonly cs: ConfigService,
		private readonly jwtService: JwtService
	) {

	}

	async login(user: UserEntity, response: Response) {
		const payload: JwtPayloadDto =
			{
				id: user.id,
				email: user.email
			};
		const expiresIn = new Date();


		const token = this.jwtService.sign(payload, {
			expiresIn: this.cs.getOrThrow('JWT_EXPIRE'),
			secret: this.cs.getOrThrow('JWT_SECRET')
		});

		expiresIn.setSeconds(
			expiresIn.getSeconds() + this.cs.getOrThrow('JWT_EXPIRE')
		);

		response.cookie('token', token, { httpOnly: true, expires: expiresIn });
	}


}