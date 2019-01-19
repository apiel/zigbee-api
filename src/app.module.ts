import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { ZigbeeModule } from './zigbee/zigbee.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule, ZigbeeModule, ApiModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
