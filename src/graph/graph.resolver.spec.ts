import { Test, TestingModule } from '@nestjs/testing';
import { GraphResolver } from './graph.resolver';

describe('GraphResolver', () => {
  let resolver: GraphResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphResolver],
    }).compile();

    resolver = module.get<GraphResolver>(GraphResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
