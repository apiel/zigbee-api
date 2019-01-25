import { Module } from '@nestjs/common';
import { zigbeeServiceFactory } from './zigbee-service.factory';
import { ConfigModule } from 'src/config/config.module';

@Module({
    providers: [zigbeeServiceFactory],
    imports: [ConfigModule],
    exports: [zigbeeServiceFactory],
})
export class ZigbeeModule {}
