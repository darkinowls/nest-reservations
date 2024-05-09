import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {


	constructor(
		private readonly userService: UsersService
	) {
		super({
			usernameField: 'email'
		});
	}

	async validate(email: string, password: string) {
		try {
			return await this.userService.validateUser(email, password);
		} catch (error) {
			throw new UnauthorizedException('Invalid credentials');
		}
	}

}