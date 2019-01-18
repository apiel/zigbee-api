import { Module } from '@nestjs/common';
import { ZigbeeService } from './zigbee.service';
import { shepherdFactory } from './shepherd.factory';
import { ConfigModule } from 'src/config/config.module';

@Module({
  providers: [ZigbeeService, shepherdFactory],
  // exports: [shepherdFactory],
  imports: [ConfigModule],
})
export class ZigbeeModule {}