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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const zigbee_service_1 = require("src/zigbee/zigbee.service");
const FIVE_MIN = 5 * 60 * 1000;
let EventService = class EventService {
    constructor(zigbeeService) {
        this.list = [];
        this.onEvent = (type) => (payload) => {
            const time = new Date();
            this.list.push({ type, payload, time });
            this.timerClean = setTimeout(this.clean, 100);
        };
        this.clean = () => {
            this.list = this.list.filter((item) => this.isLessThan5MinOld(item));
        };
        zigbeeService.on(zigbee_service_1.eventType.indMessage, this.onEvent(zigbee_service_1.eventType.indMessage));
        zigbeeService.on(zigbee_service_1.eventType.devIncoming, this.onEvent(zigbee_service_1.eventType.devIncoming));
        zigbeeService.on(zigbee_service_1.eventType.afIncomingMsg, this.onEvent(zigbee_service_1.eventType.afIncomingMsg));
        zigbeeService.on(zigbee_service_1.eventType.devices, this.onEvent(zigbee_service_1.eventType.devices));
    }
    get() {
        this.clean();
        return this.list;
    }
    isLessThan5MinOld(item) {
        const now = new Date();
        const time = item.time;
        const duration = now - time;
        return duration < FIVE_MIN;
    }
};
EventService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [zigbee_service_1.ZigbeeService])
], EventService);
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map