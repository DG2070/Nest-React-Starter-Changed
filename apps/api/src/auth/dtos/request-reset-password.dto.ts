import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetForgottenPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
