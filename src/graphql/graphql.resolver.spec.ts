import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlResolver } from './graphql.resolver';

describe('GraphqlResolver', () => {
  let resolver: GraphqlResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphqlResolver],
    }).compile();

    resolver = module.get<GraphqlResolver>(GraphqlResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
