import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleDto {
	@IsOptional()
	@IsString()
		_id: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
		name: string;
}