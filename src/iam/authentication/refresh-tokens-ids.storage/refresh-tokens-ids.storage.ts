import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokensIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap() {
    // todo: create and move to the dedicated Redis module
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    });
  }
  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisClient.set(this._getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this._getKey(userId));
    if (storedId) {
      throw new InvalidateRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this._getKey(userId));
  }

  private _getKey(userId: string): string {
    return `user-${userId}`;
  }
}
