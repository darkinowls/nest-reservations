import { IsEmail, IsString } from 'class-validator';

export class NotifyUserDto {
	@IsEmail()
		email: string;

	@IsString()
		subject: string;

	@IsString()
		message: string;
}