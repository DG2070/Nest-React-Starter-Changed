import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OTPLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}
