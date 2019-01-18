import { Injectable } from '@nestjs/common';
import { ZigbeeService } from './zigbee/zigbee.service';

@Injectable()
export class AppService {
  constructor(private zigbeeService: ZigbeeService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
