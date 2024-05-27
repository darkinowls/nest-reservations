import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '@app/common/dto/user.dto';


export const GetUser =
	createParamDecorator((_, req: ExecutionContext): UserDto | null => {
		if (req.getType() === 'http') {
			return req.switchToHttp().getRequest().user;
		}
		console.log('@GET_USER');
		console.log(req.getArgs());
		const user = req.getArgs()[2]?.req.headers?.user;
		if (user) {
			return JSON.parse(user);
		}
		return null;
	});