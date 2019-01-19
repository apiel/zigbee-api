import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ZigbeeModule } from 'src/zigbee/zigbee.module';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [ApiController],
  imports: [ZigbeeModule, EventModule],
})
export class ApiModule {}
