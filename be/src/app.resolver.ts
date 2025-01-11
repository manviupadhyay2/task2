// app.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello() {
    return 'Hello World from GraphQL';
  }
}

