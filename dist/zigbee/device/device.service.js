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
var DeviceService_1;
const common_1 = require("@nestjs/common");
const zigbee_service_1 = require("zigbee-service");
let DeviceService = DeviceService_1 = class DeviceService extends zigbee_service_1.DeviceService {
    constructor(shepherd) {
        super(shepherd, new common_1.Logger(DeviceService_1.name));
    }
};
DeviceService = DeviceService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('Shepherd')),
    __metadata("design:paramtypes", [Object])
], DeviceService);
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map