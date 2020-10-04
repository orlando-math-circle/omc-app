import { Controller, Get, Query } from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('/twitter')
export class TwitterController {
  constructor(private readonly twitter: TwitterService) {}

  @Get()
  getTweets(@Query('limit') limit: number) {
    return this.twitter.getTweets(limit);
  }
}
