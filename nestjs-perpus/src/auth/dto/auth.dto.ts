import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  // Use Validation like validator
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
