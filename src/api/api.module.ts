import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ZigbeeModule } from 'src/zigbee/zigbee.module';
import { EventService } from './event/event.service';

@Module({
  controllers: [ApiController],
  imports: [ZigbeeModule],
  providers: [EventService],
})
export class ApiModule {}
