import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ActiveUser } from './decorators/active-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { ChangePasswordDto } from './dtos/change-password.otp';
import { GetSignInOTPDto } from './dtos/get-login.otp';
import { OTPLoginDto } from './dtos/otp-login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ResetForgottenPasswordDto } from './dtos/request-reset-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ValidateResetPasswordOTPDto } from './dtos/validate-reset-password-otp.dto';
import { AuthType } from './enums/auth-type.enum';
import { ActiveUserData } from './interfaces/active-user-data.interfce';
import { PasswordService } from './password.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly passwordService: PasswordService,
  ) {}
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    return await this.authenticationService.signIn(signInDto);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('get-sign-in-otp')
  async getLoginOTP(@Body() getSignInOTPDto: GetSignInOTPDto) {
    return await this.authenticationService.getLoginOTP(getSignInOTPDto);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('otp-sign-in')
  async otpSignIn(@Body() OTPLoginDto: OTPLoginDto) {
    return await this.authenticationService.otpSignIn(OTPLoginDto);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authenticationService.refreshTokens(refreshTokenDto);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async chnagePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @ActiveUser() loggedInUser: ActiveUserData,
  ) {
    return await this.passwordService.changePassword(
      changePasswordDto,
      loggedInUser,
    );
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() resetForgottenPasswordDto: ResetForgottenPasswordDto,
  ) {
    return await this.passwordService.getResetPasswordOTP(
      resetForgottenPasswordDto,
    );
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('request-reset-password-otp-validation')
  async validateResetPasswordOtp(
    @Body() validateResetPasswordOTPDto: ValidateResetPasswordOTPDto,
  ) {
    return await this.passwordService.validateResetPasswordOTP(
      validateResetPasswordOTPDto,
    );
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('reset-forgotten-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @ActiveUser() loggedInUser: ActiveUserData,
  ) {
    return await this.passwordService.resetPassword(
      resetPasswordDto,
      loggedInUser,
    );
  }

  @Auth(AuthType.None)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Auth(AuthType.None)
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any) {
    return this.authenticationService.handleGoogleLogin(req.user);
  }

  @Auth(AuthType.Bearer)
  @Get('me')
  me(@ActiveUser() loggedInUser: ActiveUserData) {
    return { email: loggedInUser.email, roles: loggedInUser.roles };
  }
}
