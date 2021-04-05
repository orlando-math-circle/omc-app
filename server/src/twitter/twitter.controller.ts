import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('/twitter')
@UseInterceptors(CacheInterceptor)
export class TwitterController {
  constructor(private readonly twitter: TwitterService) {}

  @CacheTTL(60)
  @Get()
  getTweets(@Query('limit') limit: number) {
    return this.twitter.getTweets(limit);
  }
}
