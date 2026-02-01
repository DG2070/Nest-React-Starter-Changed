import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import { redisConfig } from 'src/configurations/redis.config';

@Injectable()
export class RedisStorageService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}
  private redishClient: Redis;
  onApplicationBootstrap() {
    this.redishClient = new Redis({
      host: this.redisConfiguration.host,
      port: this.redisConfiguration.port,
      lazyConnect: this.redisConfiguration.lazyConnect,
    });
  }

  onApplicationShutdown(signal?: string) {
    return this.redishClient.quit();
  }

  async insert(
    keyPart: string,
    userId: number,
    value: string,
    ttlSeconds = 600,
  ) {
    await this.redishClient.set(
      this.getKey(keyPart, userId),
      value,
      'EX',
      ttlSeconds,
    );
    return;
  }

  async getStoredValue(keyPart: string, userId: number) {
    return await this.redishClient.get(this.getKey(keyPart, userId));
  }

  async validate(keyPart: string, userId: number, value: string) {
    const storedValue = await this.redishClient.get(
      this.getKey(keyPart, userId),
    );
    return storedValue === value;
  }

  async invalidate(keyPart: string, userId: number) {
    await this.redishClient.del(this.getKey(keyPart, userId));
    return;
  }

  private getKey(keyPart: string, userId: number) {
    return `${keyPart}user-${userId}`;
  }
}
