import { AuthService } from './auth.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {

	constructor(private readonly authService: AuthService) {
	}

	@Query(() => String)
	hello() {
		return 'Hello World!';
	}
}