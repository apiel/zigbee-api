"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const zigbee_service_1 = require("zigbee-service");
const device_service_1 = require("src/zigbee/device/device.service");
const event_service_1 = require("src/event/event.service");
const graphql_schema_1 = require("src/types/graphql.schema");
const zigbee_service_2 = require("src/zigbee/zigbee.service");
const pubSub = new graphql_subscriptions_1.PubSub();
let GraphqlResolver = class GraphqlResolver {
    constructor(deviceService, eventService, zigbeeService) {
        this.deviceService = deviceService;
        this.eventService = eventService;
        this.onEvent = (type) => (payload) => {
            const events = {
                type,
                payload,
                time: (new Date()).toString(),
            };
            pubSub.publish('events', { events });
        };
        zigbeeService.on(zigbee_service_1.eventType.indMessage, this.onEvent(zigbee_service_1.eventType.indMessage));
        zigbeeService.on(zigbee_service_1.eventType.devIncoming, this.onEvent(zigbee_service_1.eventType.devIncoming));
        zigbeeService.on(zigbee_service_1.eventType.afIncomingMsg, this.onEvent(zigbee_service_1.eventType.afIncomingMsg));
    }
    getDevices() {
        return this.deviceService.getDevices();
    }
    device(addr) {
        return this.deviceService.getDevice(addr);
    }
    getDeviceConfig(addr) {
        const mappedModel = this.deviceService.getMappedModel(addr);
        return {
            device: mappedModel.device,
            config: mappedModel.mappedModel,
        };
    }
    getEvents() {
        return this.eventService.get().map(item => (Object.assign({}, item, { payload: item.payload, time: item.time.toString() })));
    }
    sendAction(addr, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.deviceService.sendAction(Object.assign({}, action, { addr }));
            return response;
        });
    }
    events() {
        return {
            subscribe: () => pubSub.asyncIterator('events'),
        };
    }
};
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], GraphqlResolver.prototype, "getDevices", null);
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Args('addr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], GraphqlResolver.prototype, "device", null);
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Args('addr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", graphql_schema_1.DeviceConfig)
], GraphqlResolver.prototype, "getDeviceConfig", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], GraphqlResolver.prototype, "getEvents", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('addr')), __param(1, graphql_1.Args('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GraphqlResolver.prototype, "sendAction", null);
__decorate([
    graphql_1.Subscription(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GraphqlResolver.prototype, "events", null);
GraphqlResolver = __decorate([
    graphql_1.Resolver('Graphql'),
    __metadata("design:paramtypes", [device_service_1.DeviceService,
        event_service_1.EventService,
        zigbee_service_2.ZigbeeService])
], GraphqlResolver);
exports.GraphqlResolver = GraphqlResolver;
//# sourceMappingURL=graphql.resolver.js.map