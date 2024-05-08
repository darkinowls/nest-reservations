import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

import { UsersModule } from "./users/users.module";
import { AuthService } from "./auth.service";
import { AppLoggerModule } from "@app/common/app-logger/app-logger.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AppConfigModule } from "@app/common/app-config/app-config.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { PassportModule } from "@nestjs/passport";


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, LocalStrategy],
  imports: [
    // PassportModule,
    UsersModule,
    AppLoggerModule,
    AppConfigModule,
    JwtModule.registerAsync({
      useFactory: (cs: ConfigService) => ({
        secret: cs.getOrThrow("JWT_SECRET"),
        signOptions: { expiresIn: cs.getOrThrow("JWT_EXPIRE") }
      }),
      inject: [ConfigService],
      imports: [AppConfigModule]
    })
  ]
})
export class AuthModule {
}
