import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioController } from './minio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioFile } from './entities/minio-images.entity';
import { MinioService } from './minio.service';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([MinioFile])],
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory: (configService: ConfigService) => {
        const Minio = require('minio');
        return new Minio.Client({
          endPoint: configService.get<string>('STORAGE_ENDPOINT'),
          port: configService.get<number>('STORAGE_PORT', 443),
          useSSL:
            configService.get<string>('STORAGE_USE_SSL', 'true') === 'true',
          accessKey: configService.get<string>('STORAGE_ACCESS_KEY_ID'),
          secretKey: configService.get<string>('STORAGE_SECRET_ACCESS_KEY'),
          region: configService.get<string>(
            'STORAGE_DEFAULT_REGION',
            'us-east-1',
          ),
          pathStyle: true,
        });
      },
      inject: [ConfigService],
    },
    MinioService,
  ],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
