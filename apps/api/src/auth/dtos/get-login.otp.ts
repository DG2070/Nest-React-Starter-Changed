import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetSignInOTPDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
