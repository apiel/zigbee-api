"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const GraphQLJSON = require("graphql-type-json");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_service_1 = require("./config/config.service");
const config_module_1 = require("./config/config.module");
const zigbee_module_1 = require("./zigbee/zigbee.module");
const api_module_1 = require("./api/api.module");
const graphql_module_1 = require("./graphql/graphql.module");
const event_module_1 = require("./event/event.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_module_1.ConfigModule,
            zigbee_module_1.ZigbeeModule,
            api_module_1.ApiModule,
            graphql_1.GraphQLModule.forRoot({
                typePaths: ['./**/*.graphql'],
                resolvers: { JSON: GraphQLJSON },
                installSubscriptionHandlers: true,
                definitions: {
                    path: `${__dirname}/types/graphql.schema.ts`,
                    outputAs: 'class',
                },
            }),
            graphql_module_1.GraphqlModule,
            event_module_1.EventModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, config_service_1.ConfigService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map