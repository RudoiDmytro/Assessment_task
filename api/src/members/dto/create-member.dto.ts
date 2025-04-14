import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  address: string;
} 