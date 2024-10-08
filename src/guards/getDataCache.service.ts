import { Injectable } from '@nestjs/common';
import { RedisService } from '../services/redisService/redis.service';
import {
  UserIncludeType,
  UserRepository,
} from '../modules/user/user.repository';
import { UserDto } from '../dto/user.dto';
import { REDIS_KEY } from '../services/redisService/redisKey';

@Injectable()
export class GetDataCacheService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserData(userId: number): Promise<UserDto | UserIncludeType | null> {
    const redisKey = `${REDIS_KEY.CACHE}_USER_${userId}`;
    const cacheData = await this.redisService.get(redisKey);

    if (cacheData) {
      return JSON.parse(cacheData);
    }

    return await this.userRepository.findUserById(userId);
  }

  isHasStore(user: UserDto | UserIncludeType): boolean {
    if ('store' in user && user.store) {
      return true;
    }

    if ('stores' in user && user.stores && user.stores.length > 0) {
      return true;
    }

    return false;
  }
}
