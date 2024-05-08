import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

import { UsersModule } from "./users/users.module";
import { AuthService } from "./auth.service";
import { AppLoggerModule } from "@app/common/app-logger/app-logger.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfigModule } from "@app/common/app-config/app-config.module";


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule,
    AppLoggerModule,
    AppConfigModule,
    JwtModule.registerAsync({
      useFactory: (cs: ConfigService) => ({
        secret: cs.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: cs.getOrThrow('JWT_EXPIRE') },
      }),
      inject: [ConfigService],
      imports: [AppConfigModule]
    }),
  ]
})
export class AuthModule {
}
