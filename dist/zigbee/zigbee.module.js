"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const zigbee_service_1 = require("./zigbee.service");
const shepherd_factory_1 = require("./shepherd.factory");
const config_module_1 = require("src/config/config.module");
const device_service_1 = require("./device/device.service");
let ZigbeeModule = class ZigbeeModule {
};
ZigbeeModule = __decorate([
    common_1.Module({
        providers: [zigbee_service_1.ZigbeeService, shepherd_factory_1.shepherdFactory, device_service_1.DeviceService],
        imports: [config_module_1.ConfigModule],
        exports: [zigbee_service_1.ZigbeeService, device_service_1.DeviceService],
    })
], ZigbeeModule);
exports.ZigbeeModule = ZigbeeModule;
//# sourceMappingURL=zigbee.module.js.map