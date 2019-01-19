import { Module } from '@nestjs/common';
import { CatsResolvers } from './cats.resolver';

@Module({
  providers: [CatsResolvers],
})
export class CatsModule {}
