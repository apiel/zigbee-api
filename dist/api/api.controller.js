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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const device_service_1 = require("../zigbee/device/device.service");
const swagger_1 = require("@nestjs/swagger");
const api_action_dto_1 = require("./api.action.dto");
const event_service_1 = require("src/event/event.service");
let ApiController = class ApiController {
    constructor(deviceService, eventService) {
        this.deviceService = deviceService;
        this.eventService = eventService;
    }
    getDevices() {
        return this.deviceService.getDevices();
    }
    getDevice(addr) {
        return this.deviceService.getMappedModel(addr);
    }
    sendAction(addr, action) {
        return this.deviceService.sendAction(Object.assign({}, action, { addr }));
    }
    getEvents() {
        return this.eventService.get();
    }
};
__decorate([
    swagger_1.ApiOkResponse({ description: 'Get the list of registered devices.' }),
    common_1.Get('devices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], ApiController.prototype, "getDevices", null);
__decorate([
    swagger_1.ApiOkResponse({ description: 'Get device details.' }),
    common_1.Get('devices/:addr'),
    __param(0, common_1.Param('addr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], ApiController.prototype, "getDevice", null);
__decorate([
    swagger_1.ApiOkResponse({ description: 'Send action to device.' }),
    common_1.Post('devices/:addr/action'),
    __param(0, common_1.Param('addr')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, api_action_dto_1.ApiActionDto]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "sendAction", null);
__decorate([
    swagger_1.ApiOkResponse({ description: 'Get the list of events.' }),
    common_1.Get('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], ApiController.prototype, "getEvents", null);
ApiController = __decorate([
    common_1.Controller('api'),
    __metadata("design:paramtypes", [device_service_1.DeviceService,
        event_service_1.EventService])
], ApiController);
exports.ApiController = ApiController;
//# sourceMappingURL=api.controller.js.map