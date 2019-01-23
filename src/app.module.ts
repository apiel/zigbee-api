import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as GraphQLJSON from 'graphql-type-json';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { ZigbeeModule } from './zigbee/zigbee.module';
import { ApiModule } from './api/api.module';
import { GraphqlModule } from './graphql/graphql.module';
import { EventModule } from './event/event.module';

@Module({
    imports: [
        ConfigModule,
        ZigbeeModule,
        ApiModule,
        GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            resolvers: { JSON: GraphQLJSON },
            installSubscriptionHandlers: true,
            definitions: {
                path: `${__dirname}/types/graphql.schema.ts`,
                outputAs: 'class',
            },
        }),
        GraphqlModule,
        EventModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule {}
