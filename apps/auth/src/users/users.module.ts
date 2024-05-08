import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppLoggerModule } from "@app/common/app-logger/app-logger.module";
import { DatabaseModule } from "@app/common/database/database.module";
import { UserDocument } from "./entities/user.entity";
import { UserRepository } from "./user.repository";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  imports: [
    AppLoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      UserDocument.definition
    ])
  ]
})
export class UsersModule {}
