import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { formatGraphqlError } from "@src/common/helpers/format-error";
import { RealtiesModule } from "@src/modules/realties/realties.module";
import { SharedModule } from "@src/modules/shared/shared.module";

@Module({
  imports: [
    RealtiesModule,
    SharedModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: formatGraphqlError,
      playground: true,
      introspection: true,
    }),
  ],
})
export class AppModule {}
