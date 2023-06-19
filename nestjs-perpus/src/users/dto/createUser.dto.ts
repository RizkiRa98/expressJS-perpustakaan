import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  // @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Format email salah' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['super admin', 'admin'])
  role: string;
}
