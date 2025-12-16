import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResetForgottenPasswordDto } from './dtos/request-reset-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ValidateResetPasswordOTPDto } from './dtos/validate-reset-password-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/common/helper-modules/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/configurations/jwt.config';
import { ConfigType } from '@nestjs/config';
import { EmailService } from 'src/common/helper-modules/mailing/mailing.service';
import { InvalidOTPException } from 'src/common/errors/esewa-payment-gateway.errors';
import { getRandomInt } from 'src/common/helper-functions/random-integers.helper';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from './dtos/change-password.otp';
import { ActiveUserData } from './interfaces/active-user-data.interfce';
import { resetPasswordOTP } from 'src/common/helper-modules/mailing/html-as-constants/reset-password-otp';
import { RedisStorageService } from 'src/common/helper-modules/redis/redis-storage.service';
import { REDIS_RESET_PASSWORD_OTP_KEY_PART } from './constants/auth-constants';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly redisStorageService: RedisStorageService,
    private readonly emailService: EmailService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    loggedInUser: ActiveUserData,
  ) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'roles'],
      where: { email: loggedInUser.email },
      relations: ['roles'],
    });
    if (!user)
      throw new UnauthorizedException(
        `There was error retriving your data. Try again !! `,
      );
    const existingPasswordMatch = await this.hashingService.compare(
      changePasswordDto.existingPassword,
      user.password,
    );
    if (!existingPasswordMatch) {
      throw new UnauthorizedException(`Old password does not match.`);
    }

    const matchWithPreviousPassword = await this.hashingService.compare(
      changePasswordDto.newPassword,
      user.password,
    );

    if (matchWithPreviousPassword)
      throw new ConflictException(
        `New password should be different from the existing one.`,
      );

    const newHashedPassword = await this.hashingService.hash(
      changePasswordDto.newPassword,
    );
    Object.assign(user, { password: newHashedPassword });
    const updatedUserInstance = this.usersRepository.create(user);
    const savedUser = await this.usersRepository.save(updatedUserInstance);
    return {
      success: true,
      message: `Password updated successfully. Now you can log in with New Password.`,
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    loggedInUser: ActiveUserData,
  ) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'roles'],
      where: { email: loggedInUser.email },
      relations: ['roles'],
    });
    if (!user)
      throw new UnauthorizedException(
        `There was error retriving your data. Try again !! `,
      );
    const existingPasswordMatch = await this.hashingService.compare(
      resetPasswordDto.password,
      user.password,
    );
    if (existingPasswordMatch) {
      throw new ConflictException(
        `You entered your old password. Please enter different one to change or continue signing in with this password.`,
      );
    }

    const newHashedPassword = await this.hashingService.hash(
      resetPasswordDto.password,
    );
    Object.assign(user, { password: newHashedPassword });
    const updatedUserInstance = this.usersRepository.create(user);
    const savedUser = await this.usersRepository.save(updatedUserInstance);

    return await this.authenticationService.generateTokens(user);
  }

  async validateResetPasswordOTP(
    validateResetPasswordOTPDto: ValidateResetPasswordOTPDto,
  ) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'roles'],
      where: { email: validateResetPasswordOTPDto.email },
      relations: ['roles'],
    });

    if (!user)
      throw new UnauthorizedException(
        `User does not exist in our system. Continue Signing UP first.`,
      );

    try {
      const storedOTPValue = await this.redisStorageService.getStoredValue(
        REDIS_RESET_PASSWORD_OTP_KEY_PART,
        user.id,
      );

      if (!storedOTPValue)
        throw new InvalidOTPException(
          `No any resetting password OTP generated for this user. Continue resetting password with OTP again.`,
        );

      const isValidOTP = await this.hashingService.compare(
        String(validateResetPasswordOTPDto.otp),
        storedOTPValue,
      );

      if (!isValidOTP) {
        throw new InvalidOTPException(
          'Invalid OTP. Please re-check and try again.',
        );
      }

      await this.redisStorageService.invalidate(
        REDIS_RESET_PASSWORD_OTP_KEY_PART,
        user.id,
      );
    } catch (error) {
      if (error instanceof InvalidOTPException) throw error;
      throw new InternalServerErrorException(`Error checking validity of OTP.`);
    }

    return await this.authenticationService.generateTokens(user);
  }

  async getResetPasswordOTP(
    resetForgottenPasswordDto: ResetForgottenPasswordDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: { email: resetForgottenPasswordDto.email },
    });

    if (!user)
      throw new UnauthorizedException(
        `You are not registered in our system. Continue Signing UP first.`,
      );

    const storedOTPValue = await this.redisStorageService.getStoredValue(
      REDIS_RESET_PASSWORD_OTP_KEY_PART,
      user.id,
    );

    if (storedOTPValue)
      throw new ConflictException(
        `There is an active OTP sent to your Email. Use that or try again in another 3 minutes.`,
      );

    const otp = getRandomInt(100000, 999999);
    const hashedPasswordOTP = await this.hashingService.hash(String(otp));

    await this.redisStorageService.insert(
      REDIS_RESET_PASSWORD_OTP_KEY_PART,
      user.id,
      hashedPasswordOTP,
      parseInt(process.env.RESET_PASSWORD_OTP_TTL ?? '180', 10),
    );

    await this.emailService.sendMail(
      user.email,
      `Nest-react-starter reset password OTP`,
      resetPasswordOTP,
      { name: resetForgottenPasswordDto.email.split('@')[0], otp: otp },
    );

    return {
      success: true,
      message: `OTP has been sent to your email. Valid for 3 minutes.`,
      userEmail: user.email,
    };
  }
}

//By reset link

// async getResetPasswordLink(resetForgottenPasswordDto: ResetForgottenPasswordDto) {
//   const user = await this.usersRepository.findOne({
//     where: { email: resetForgottenPasswordDto.email },
//   });

//   if (!user)
//     throw new UnauthorizedException(
//       `You are not registered in our system. Continue Signing UP first.`,
//     );

//   // Check if already a valid token exists
//   const existingToken = await this.redisStorageService.getStoredValue(
//     REDIS_RESET_PASSWORD_TOKEN_KEY_PART,
//     user.id,
//   );

//   if (existingToken)
//     throw new ConflictException(
//       `A reset link is already active. Please check your email or try again after it expires.`,
//     );

//   // Generate a unique token (JWT or UUID)
//   const token = randomUUID(); // or jwt.sign({...}, secret, { expiresIn: '10m' })

//   await this.redisStorageService.insert(
//     REDIS_RESET_PASSWORD_TOKEN_KEY_PART,
//     user.id,
//     token,
//     parseInt(process.env.RESET_PASSWORD_TOKEN_TTL ?? '600', 10), // 10 min default
//   );

//   const resetUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

//   await this.emailService.sendMail(
//     user.email,
//     `Reset your password`,
//     resetPasswordLinkTemplate, // create this HTML template
//     { name: user.email.split('@')[0], resetUrl },
//   );

//   return {
//     success: true,
//     message: `A password reset link has been sent to your email. It is valid for 10 minutes.`,
//     userEmail: user.email,
//   };
// }

// async resetPasswordByLink(resetPasswordDto: ResetPasswordByLinkDto) {
//   const { token, password } = resetPasswordDto;

//   // Find token in Redis
//   const userId = await this.redisStorageService.findUserIdByToken(
//     REDIS_RESET_PASSWORD_TOKEN_KEY_PART,
//     token,
//   );

//   if (!userId)
//     throw new UnauthorizedException(`Invalid or expired reset link.`);

//   const user = await this.usersRepository.findOne({
//     where: { id: userId },
//   });

//   if (!user)
//     throw new UnauthorizedException(`User does not exist.`);

//   // Prevent reusing old password
//   const isSamePassword = await this.hashingService.compare(password, user.password);
//   if (isSamePassword)
//     throw new ConflictException(`You entered your old password. Please use a new one.`);

//   // Hash and save new password
//   user.password = await this.hashingService.hash(password);
//   await this.usersRepository.save(user);

//   // Invalidate token after use
//   await this.redisStorageService.invalidate(
//     REDIS_RESET_PASSWORD_TOKEN_KEY_PART,
//     user.id,
//   );

//   return {
//     success: true,
//     message: `Your password has been successfully reset.`,
//   };
// }
