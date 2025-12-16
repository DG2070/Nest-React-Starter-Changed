import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HashingModule } from './common/helper-modules/hashing/hashing.module';
import { RedisModule } from './common/helper-modules/redis/redis.module';
import { ConfigurationModule } from './configurations/configuration.module';
import { PermissionModule } from './permission/permission.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { MailingModule } from './common/helper-modules/mailing/mailing.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EmptyToNullInterceptor } from './common/interceptors/empty-to-null.interceptor';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    RedisModule,
    MailingModule,
    HashingModule,
    PermissionModule,
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: EmptyToNullInterceptor,
    },
  ],
})
export class AppModule {}
