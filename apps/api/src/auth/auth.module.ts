import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { PermissionGuard } from './guards/permissions.guard';
import { jwtConfig } from 'src/configurations/jwt.config';
import { redisConfig } from 'src/configurations/redis.config';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { PasswordService } from './password.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(redisConfig),
    PassportModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    // { provide: APP_GUARD, useClass: RolesGuard }, //for Roles Guard
    AccessTokenGuard,
    AuthenticationGuard,
    AuthenticationService,
    PasswordService,
    GoogleStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthModule {}
