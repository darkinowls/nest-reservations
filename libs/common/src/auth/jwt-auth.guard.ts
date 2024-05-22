import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, tap } from 'rxjs';
import { AUTH_MESSAGE, AUTH_SERVICE } from '@app/common/consts';
import { Reflector } from '@nestjs/core';


@Injectable()
export class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		@Inject(AUTH_SERVICE) private readonly ac: ClientProxy,
		private readonly reflector: Reflector
	) {
	}

	canActivate(context: ExecutionContext): Observable<boolean> | boolean {
		const jwt = context.switchToHttp().getRequest().cookies?.token;
		if (!jwt) {
			return false;
		}
		this.logger.log(jwt);
		this.logger.log('Client Guard');

		console.log(context.getHandler());
		const roles = this.reflector.get<string[] | undefined>('roles', context.getHandler());
		return this.ac.send(AUTH_MESSAGE, {
			token: jwt
		}).pipe(
			tap((res) => {
				// if (!roles) {
				// 	context.switchToHttp().getRequest().user = res;
				// 	return;
				// }
				if (!roles){
					context.switchToHttp().getRequest().user = res;
					return;
				}
				for (const role of roles) {
					if (res.roles.includes(role)) {
						context.switchToHttp().getRequest().user = res;
						return;
					}
				}
				const errorMessage: string = 'Not allowed to access this route';
				this.logger.error(errorMessage);
				throw new UnauthorizedException(errorMessage);
			}),
			map(() => true),
			catchError((err: UnauthorizedException) => {
				console.log(err);
				if (err instanceof UnauthorizedException) {
					throw err;
				}
				throw new UnauthorizedException();
			})
		);


	}
}