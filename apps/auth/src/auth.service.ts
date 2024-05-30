import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';

@Injectable()
export class AuthService {

	constructor(
		private readonly cs: ConfigService,
		private readonly jwtService: JwtService
	) {

	}

	async login(user: UserDocument, response: Response) {
		const payload: JwtPayloadDto =
			{
				id: user._id.toHexString(),
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


		response.cookie('nest_reservations_token', token, {
			domain: this.cs.getOrThrow('COOKIE_DOMAIN'),
			httpOnly: true,
			expires: expiresIn
		});
	}


}