import { Injectable, Logger, Inject } from '@nestjs/common';

import { DeviceService as ZSDeviceService, Shepherd } from 'zigbee-service';

@Injectable()
export class DeviceService extends ZSDeviceService {
    constructor(
        @Inject('Shepherd') shepherd: Shepherd,
    ) {
        super(shepherd, new Logger(DeviceService.name));
    }
}
