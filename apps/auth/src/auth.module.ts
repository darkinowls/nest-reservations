import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

import { UsersModule } from "./users/users.module";
import { AuthService } from "./auth.service";



@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule]
})
export class AuthModule {
}
