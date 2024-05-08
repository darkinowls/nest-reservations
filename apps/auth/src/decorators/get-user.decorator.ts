import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDocument } from "../users/entities/user.entity";


export const GetUser =
  createParamDecorator((_, req: ExecutionContext): UserDocument => {
    console.log(req.switchToHttp().getRequest().user);
    return req.switchToHttp().getRequest().user;
  });