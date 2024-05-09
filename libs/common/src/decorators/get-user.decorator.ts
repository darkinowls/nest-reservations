import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '@app/common/dto/user.dto';


export const GetUser =
	createParamDecorator((_, req: ExecutionContext): UserDto => {
		return req.switchToHttp().getRequest().user;
	});