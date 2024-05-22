import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@app/common/dto/user.dto';


export const GetUser =
	createParamDecorator((_, req: ExecutionContext): UserEntity => {
		return req.switchToHttp().getRequest().user;
	});