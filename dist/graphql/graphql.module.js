"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const graphql_resolver_1 = require("./graphql.resolver");
const zigbee_module_1 = require("src/zigbee/zigbee.module");
const event_module_1 = require("src/event/event.module");
let GraphqlModule = class GraphqlModule {
};
GraphqlModule = __decorate([
    common_1.Module({
        providers: [graphql_resolver_1.GraphqlResolver],
        imports: [zigbee_module_1.ZigbeeModule, event_module_1.EventModule],
    })
], GraphqlModule);
exports.GraphqlModule = GraphqlModule;
//# sourceMappingURL=graphql.module.js.map