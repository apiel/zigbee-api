import { Injectable, Logger, Inject } from '@nestjs/common';

import { DeviceService as ZSDeviceService } from 'zigbee-service';
import { Shepherd } from 'zigbee-service/dist/shepherd.factory';

@Injectable()
export class DeviceService extends ZSDeviceService {
    constructor(
        @Inject('Shepherd') shepherd: Shepherd,
    ) {
        super(shepherd, new Logger(DeviceService.name));
    }
}
