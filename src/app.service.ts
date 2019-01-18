import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(config: ConfigService) {
    console.log('SERIAL_PATH', config.get('SERIAL_PATH'));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
