import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, tap } from 'rxjs';
import { AUTH_MESSAGE, AUTH_SERVICE } from '@app/common/consts';


@Injectable()
export class JwtAuthGuard implements CanActivate {

	constructor(
		@Inject(AUTH_SERVICE) private readonly ac: ClientProxy
	) {
	}

	canActivate(context: ExecutionContext): Observable<boolean> | boolean {
		const jwt = context.switchToHttp().getRequest().cookies?.token;
		if (!jwt) {
			return false;
		}
		console.log(jwt);
		console.log('CLient Guard');
		return this.ac.send(AUTH_MESSAGE, {
			token: jwt
		}).pipe(
			tap((res) => {
				context.switchToHttp().getRequest().user = res;
			}),
			map(() => true),
			catchError(() => {
				throw new UnauthorizedException()
			})
		);


	}
}