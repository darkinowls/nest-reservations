import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleDto {
	@IsOptional()
	@IsString()
		id: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
		name: string;
}