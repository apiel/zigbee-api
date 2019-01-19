import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { ZigbeeModule } from 'src/zigbee/zigbee.module';

@Module({
  providers: [EventService],
  imports: [ZigbeeModule],
  exports: [EventService],
})
export class EventModule {}
