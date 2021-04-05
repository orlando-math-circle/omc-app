import { Controller, Get } from '@nestjs/common';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @UserAuth('system', 'read:any')
  @Get('cpu')
  getCPU() {
    return this.systemService.getCPU();
  }

  @UserAuth('system', 'read:any')
  @Get('load')
  getLoad() {
    return this.systemService.getLoad();
  }

  @UserAuth('system', 'read:any')
  @Get('avgload')
  getAvgLoad() {
    return this.systemService.getAvgLoad();
  }
}
