import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { ZigbeeModule } from './zigbee/zigbee.module';
import { ApiModule } from './api/api.module';
import { GraphqlModule } from './graphql/graphql.module';
import { GraphModule } from './graph/graph.module';


@Module({
    imports: [
        ConfigModule,
        ZigbeeModule,
        ApiModule,
        GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
        }),
        GraphqlModule,
        GraphModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule {}
