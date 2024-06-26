import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from "@app/common/database/database.module";
import { UserDocument } from "./entities/user.entity";
import { UserRepository } from "./user.repository";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      UserDocument.definition
    ])
  ],
  exports: [UsersService]
})
export class UsersModule {}
