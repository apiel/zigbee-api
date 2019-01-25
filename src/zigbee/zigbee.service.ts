import { Injectable, Inject, Logger } from '@nestjs/common';
import { ZigbeeService as ZSZigbeeService, Shepherd } from 'zigbee-service';

import { DeviceService } from './device/device.service';

@Injectable()
export class ZigbeeService extends ZSZigbeeService {
    constructor(
        @Inject('Shepherd') shepherd: Shepherd,
        deviceService: DeviceService,
    ) {
        super(shepherd, deviceService, new Logger(ZigbeeService.name));
    }
}
