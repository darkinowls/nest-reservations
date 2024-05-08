import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GetUser } from "./decorators/get-user.decorator";
import { UserDocument } from "./users/entities/user.entity";
import { Request, Response } from "express";
import { CreateUserDto } from "./users/dto/create-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";


@Controller()
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(AuthGuard('local'))
  @Post("login")
  async login(
    @GetUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto) {
    const resUser = await this.authService.login(user, response);
    response.send(user);
  }

}
