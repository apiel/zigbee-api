import { Module } from '@nestjs/common';
import { GraphResolver } from './graph.resolver';
import { ZigbeeModule } from 'src/zigbee/zigbee.module';

@Module({
    providers: [GraphResolver],
    imports: [ZigbeeModule],
})
export class GraphModule {}
