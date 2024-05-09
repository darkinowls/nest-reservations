import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UsersService,
		configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					console.log(request.cookies);
					return request?.cookies?.token;
				}
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow('JWT_SECRET')
		});
	}

	async validate(payload: JwtPayloadDto) {
		return this.userService.findOne(payload.id);
	}
}