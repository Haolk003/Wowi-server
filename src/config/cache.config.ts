import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  createCacheOptions():
    | CacheOptions<Record<string, any>>
    | Promise<CacheOptions<Record<string, any>>> {
    return {
      ttl: 5,
      max: 10,
    };
  }
}
