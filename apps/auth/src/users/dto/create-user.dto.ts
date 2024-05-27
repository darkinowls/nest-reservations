import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {

	@Field()
	@IsEmail()
		email: string;

	@Field()
	@IsStrongPassword()
		password: string;

	@Field(() => [String], {
		nullable: true
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
		roles?: string[];

}
