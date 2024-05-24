import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	OnModuleInit,
	UnauthorizedException
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, AuthServiceClient, UserMessage } from '@app/common/proto/auth';


@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
	private readonly logger = new Logger(JwtAuthGuard.name);
	private heroesService: AuthServiceClient;

	constructor(
		@Inject(AUTH_PACKAGE_NAME) private readonly client: ClientGrpc,
		private readonly reflector: Reflector
	) {
	}

	onModuleInit() {
		this.heroesService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
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
		return this.heroesService.auth({
			token: jwt
		}).pipe(
			tap((res: UserMessage) => {
				console.log('ROLE HANDLER');
				console.log(res);
				if (!roles) {
					context.switchToHttp().getRequest().user = res;
					return;
				}
				for (const role of roles) {
					if (res.roles.includes(role)) {
						context.switchToHttp().getRequest().user = {
							...res,
						}
						return;
					}
				}
				const errorMessage: string = 'Not allowed to access this route';
				this.logger.error(errorMessage);
				throw new UnauthorizedException(errorMessage);
			}),
			map(() => true),
			catchError((err) => {
				console.log(err);
				if (err instanceof UnauthorizedException) {
					throw err;
				}
				throw new UnauthorizedException();
			})
		);


	}
}