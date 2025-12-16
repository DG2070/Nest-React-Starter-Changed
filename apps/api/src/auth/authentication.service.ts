import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { safeError } from 'src/common/helper-functions/safe-error.helper';
import { SignUpDto } from '../user/dto/sign-up.dto';
import { ConfigType } from '@nestjs/config';
import { HashingService } from 'src/common/helper-modules/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { runInTransaction } from 'src/common/helper-functions/transaction.helper';
import { EntityManager, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dtos/sign-in.dto';
import { randomUUID } from 'crypto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ActiveUserData } from './interfaces/active-user-data.interfce';
import { SignUpUserDto } from '../user/dto/sign-up-user.dto';
import { jwtConfig } from 'src/configurations/jwt.config';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { EmailService } from 'src/common/helper-modules/mailing/mailing.service';
import { loginOTPTemplate } from 'src/common/helper-modules/mailing/html-as-constants/login-otp-email';
import { GetSignInOTPDto } from './dtos/get-login.otp';
import { getRandomInt } from 'src/common/helper-functions/random-integers.helper';
import { OTPLoginDto } from './dtos/otp-login.dto';
import {
  InvalidOTPException,
  InvalidTokenException,
} from 'src/common/errors/esewa-payment-gateway.errors';
import {
  REDIS_REFRESH_TOKEN_KEY_PART,
  REDIS_SIGN_IN_OTP_KEY_PART,
} from './constants/auth-constants';
import { RedisStorageService } from 'src/common/helper-modules/redis/redis-storage.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly redisStorageService: RedisStorageService,
    private readonly emailService: EmailService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'roles'],
      where: { email: signInDto.email },
      relations: ['roles'],
    });
    if (!user) throw new UnauthorizedException(`User does not exist.`);
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException(`Password does not match.`);
    }
    return await this.generateTokens(user);
  }

  async otpSignIn(oTPLoginDto: OTPLoginDto) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'roles'],
      where: { email: oTPLoginDto.email },
      relations: ['roles'],
    });
    if (!user)
      throw new UnauthorizedException(
        `User does not exist in our system. Continue Signing UP first.`,
      );

    try {
      const storedOTPValue = await this.redisStorageService.getStoredValue(
        REDIS_SIGN_IN_OTP_KEY_PART,
        user.id,
      );

      if (!storedOTPValue)
        throw new InvalidOTPException(
          `No any signing in OTP generated for this user. Continue signing in with OTP again.`,
        );

      const isValidOTP = await this.hashingService.compare(
        String(oTPLoginDto.otp),
        storedOTPValue,
      );

      if (!isValidOTP) {
        throw new InvalidOTPException(
          'Invalid OTP. Please check and try again.',
        );
      }

      await this.redisStorageService.invalidate(
        REDIS_SIGN_IN_OTP_KEY_PART,
        user.id,
      );
    } catch (error) {
      if (error instanceof InvalidOTPException) throw error;
      throw new InternalServerErrorException(`Error checking validity of OTP.`);
    }

    return await this.generateTokens(user);
  }

  async getLoginOTP(getSignInOTPDto: GetSignInOTPDto) {
    const user = await this.usersRepository.findOne({
      where: { email: getSignInOTPDto.email },
    });
    if (!user)
      throw new UnauthorizedException(
        `You are not registered in our system. Continue Signing UP first.`,
      );

    const storedOTPValue = await this.redisStorageService.getStoredValue(
      REDIS_SIGN_IN_OTP_KEY_PART,
      user.id,
    );

    if (storedOTPValue)
      throw new ConflictException(
        `OTP already sent to your Email. Use that or try again in another 3 minutes.`,
      );

    const otp = getRandomInt(100000, 999999);
    const hashedOTP = await this.hashingService.hash(String(otp));

    await this.redisStorageService.insert(
      REDIS_SIGN_IN_OTP_KEY_PART,
      user.id,
      hashedOTP,
      parseInt(process.env.LOGIN_OTP_TTL ?? '180', 10),
    );

    await this.emailService.sendMail(
      getSignInOTPDto.email,
      `Nest-react-starter login otp`,
      loginOTPTemplate,
      { name: getSignInOTPDto.email.split('@')[0], otp: otp },
    );

    return {
      success: true,
      message: `OTP has been sent to your email. Valid for 3 minutes.`,
      userEmail: user.email,
    };
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        this.jwtConfiguration.secret!,
        // { email: user.email, role: user.role } this was for Roles Guard
        { email: user.email, roles: user.roles.map((role) => role.name) },
      ),
      this.signToken(
        user.id,
        this.jwtConfiguration.refreshTokenTtl,
        this.jwtConfiguration.secret!,
        {
          refreshTokenId: refreshTokenId,
        },
      ),
    ]);

    await this.redisStorageService.insert(
      REDIS_REFRESH_TOKEN_KEY_PART,
      user.id,
      refreshTokenId,
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      const user = await this.usersRepository.findOne({
        select: ['id', 'email', 'roles'],
        where: { id: sub },
        relations: ['roles'],
      });
      if (!user)
        throw new NotFoundException('This person is not the user anymore.');

      const isValid = await this.redisStorageService.validate(
        REDIS_REFRESH_TOKEN_KEY_PART,
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.redisStorageService.invalidate(
          REDIS_REFRESH_TOKEN_KEY_PART,
          user.id,
        );
      } else {
        throw new Error('Refresh token is invalid');
      }

      return await this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidTokenException) throw error;
      throw new UnauthorizedException(`Unauthorized to access resource.`);
    }
  }

  async signToken<T>(
    userId: number,
    expiresIn: number,
    secret: string,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: secret,
        expiresIn,
      },
    );
  }
}
