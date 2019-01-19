import { Module } from '@nestjs/common';
import { ZigbeeService } from './zigbee.service';
import { shepherdFactory } from './shepherd.factory';
import { ConfigModule } from 'src/config/config.module';
import { DeviceService } from './device/device.service';

@Module({
    providers: [ZigbeeService, shepherdFactory, DeviceService],
    imports: [ConfigModule],
    exports: [ZigbeeService, DeviceService],
})
export class ZigbeeModule {}
