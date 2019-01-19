import { Module } from '@nestjs/common';
import { GraphqlResolver } from './graphql.resolver';
import { ZigbeeModule } from 'src/zigbee/zigbee.module';
import { EventModule } from 'src/event/event.module';

@Module({
  providers: [GraphqlResolver],
  imports: [ZigbeeModule, EventModule],
})
export class GraphqlModule {}
