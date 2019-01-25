import { ZigbeeService as ZSZigbeeService, Shepherd } from 'zigbee-service';
import { DeviceService } from './device/device.service';
export declare class ZigbeeService extends ZSZigbeeService {
    constructor(shepherd: Shepherd, deviceService: DeviceService);
}
