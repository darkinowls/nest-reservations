import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@app/common/entities/user.entity';


export const GetUser =
	createParamDecorator((_, req: ExecutionContext): UserEntity => {
		return req.switchToHttp().getRequest().user;
	});