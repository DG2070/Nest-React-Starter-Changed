import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import {
  InvalidOTPException,
  InvalidTokenException,
} from 'src/common/errors/esewa-payment-gateway.errors';
import { getRandomInt } from 'src/common/helper-functions/random-integers.helper';
import { HashingService } from 'src/common/helper-modules/hashing/hashing.service';
import { loginOTPTemplate } from 'src/common/helper-modules/mailing/html-as-constants/login-otp-email';
import { EmailService } from 'src/common/helper-modules/mailing/mailing.service';
import { RedisStorageService } from 'src/common/helper-modules/redis/redis-storage.service';
import { jwtConfig } from 'src/configurations/jwt.config';
import { User } from 'src/user/entities/user.entity';
import {
  REDIS_REFRESH_TOKEN_KEY_PART,
  REDIS_SIGN_IN_OTP_KEY_PART,
} from './constants/auth-constants';
import { GetSignInOTPDto } from './dtos/get-login.otp';
import { OTPLoginDto } from './dtos/otp-login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ActiveUserData } from './interfaces/active-user-data.interfce';
import { Repository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { safeError } from 'src/common/helper-functions/safe-error.helper';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
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
      user.password!,
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

  async handleGoogleLogin(googleUser: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  }) {
    const [regularRole, _error] = await safeError(
      this.rolesRepository.findOne({
        where: { name: 'regular' },
      }),
    );

    if (_error)
      throw new InternalServerErrorException(
        `Error getting role to assign to the new user.`,
      );

    if (!regularRole)
      throw new NotFoundException(
        'You can not sign up now. Let the developers fix this issue.',
      );

    let user: User | null = await this.usersRepository.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = this.usersRepository.create({
        email: googleUser.email,
        name: googleUser.name,
        password: null,
        authProvider: 'google',
        providerId: googleUser.providerId,
        roles: [regularRole],
      });

      user = await this.usersRepository.save(user);
    }

    if (!user.authProvider && !user.providerId) {
      user.authProvider = 'google';
      user.providerId = googleUser.providerId;
      await this.usersRepository.save(user);
    }

    if (
      user.authProvider === 'google' &&
      user.providerId !== googleUser.providerId
    ) {
      throw new Error('Account conflict');
    }

    const theUser = await this.usersRepository.findOne({
      where: { email: user.email! },
      relations: ['roles'],
    });

    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        this.jwtConfiguration.secret!,
        // { email: user.email, role: user.role } this was for Roles Guard
        { email: user.email!, roles: user.roles.map((role) => role.name) },
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
