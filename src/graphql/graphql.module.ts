import { Module } from '@nestjs/common';
import { GraphqlResolver } from './graphql.resolver';
import { ZigbeeModule } from 'src/zigbee/zigbee.module';

@Module({
  providers: [GraphqlResolver],
  imports: [ZigbeeModule],
})
export class GraphqlModule {}
