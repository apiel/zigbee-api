import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ZigbeeModule } from 'src/zigbee/zigbee.module';

@Module({
  controllers: [ApiController],
  imports: [ZigbeeModule],
})
export class ApiModule {}
