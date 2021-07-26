import { Injectable } from '@nestjs/common';
import si from 'systeminformation';

@Injectable()
export class SystemService {
  getCPU() {
    return si.cpu();
  }

  getLoad() {
    return si.currentLoad();
  }

  getAvgLoad() {
    return si.fullLoad();
  }

  getDisk() {
    return si.disksIO();
  }

  getMemory() {
    return si.mem();
  }
}
