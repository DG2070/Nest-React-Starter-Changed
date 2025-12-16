import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from 'src/configurations/redis.config';
import { RedisStorageService } from './redis-storage.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RedisStorageService],
  exports: [RedisStorageService],
})
export class RedisModule {}
