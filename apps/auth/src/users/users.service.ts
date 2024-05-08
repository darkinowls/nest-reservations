import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {

  constructor(private readonly userRepository: UserRepository) {
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.find({});
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      _id: id
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.findOneAndUpdate({
        _id: id
      },
      updateUserDto
    );

  }

  remove(id: string) {
    return this.userRepository.findOneAndDelete({
      _id: id
    });
  }
}
