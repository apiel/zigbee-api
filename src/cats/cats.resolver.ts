import { Query, Resolver } from '@nestjs/graphql';

@Resolver('Cat')
export class CatsResolvers {
  @Query()
  getCats() {
    return [{ id: 6, name: 'askdjl', age: 5 }, { id: 2, name: 'Catbo', age: 5 }];
  }
}
