import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UsersService,
		configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					console.log(request);
					console.log('request.cookies.nest_reservations_token');
					return  request?.cookies?.nest_reservations_token || request?.token;
				}
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow('JWT_SECRET')
		});
	}


	async validate(payload: JwtPayloadDto) {
		console.log(payload);
		console.log('payload');
		return this.userService.findOne(payload.id);
	}
}
