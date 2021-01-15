import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { TWITTER_KEY, TWITTER_SECRET } from '../app.constants';

const OMC_HANDLE = 'orlandomathcir';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private token: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  public async getTweets(count = 20) {
    if (!this.token) {
      await this.getToken();
    }

    const resp = await this.http
      .get(
        `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${OMC_HANDLE}&count=${count}`,
        { headers: { Authorization: `Bearer ${this.token}` } },
      )
      .toPromise();

    return resp.data;
  }

  private async getToken() {
    const key = this.config.get(TWITTER_KEY);
    const secret = this.config.get(TWITTER_SECRET);
    const token = Buffer.from(`${key}:${secret}`, 'utf-8').toString('base64');

    const data = new FormData();
    data.append('grant_type', 'client_credentials');

    try {
      const resp = await this.http
        .post('https://api.twitter.com/oauth2/token', data, {
          headers: {
            Authorization: `Basic ${token}`,
            ...data.getHeaders(),
          },
        })
        .toPromise();
      this.token = resp.data.access_token;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
