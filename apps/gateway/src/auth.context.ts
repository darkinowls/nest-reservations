import { UnauthorizedException } from '@nestjs/common';
import { app } from './app';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_MESSAGE, AUTH_SERVICE } from '@app/common/consts';
import { lastValueFrom } from 'rxjs';

export const authContext = async ({ req }) => {
	try {
		const authClient = app.get<ClientProxy>(AUTH_SERVICE);
		const user = await lastValueFrom(
			authClient.send(AUTH_MESSAGE,
				{
					token: req.headers?.token
				}
			)
		);
		return { user };
	} catch (e) {
		throw new UnauthorizedException('Unauthorized');
	}
};