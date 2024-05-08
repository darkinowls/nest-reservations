import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { GetUser } from "../decorators/get-user.decorator";
import { UserDocument } from "./entities/user.entity";
import { Response } from "express";

@Controller("users")
@ApiTags("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post("login")
  // async login(
  //   @GetUser() user: UserDocument,
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() createUserDto: CreateUserDto) {
  //
  //
  //   const resUser = await this.usersService.validateUser(createUserDto.email, createUserDto.password);
  //   response.send(user);
  //
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
