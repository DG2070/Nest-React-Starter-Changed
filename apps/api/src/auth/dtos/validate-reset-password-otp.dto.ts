import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ValidateResetPasswordOTPDto {
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}
