import { DeviceModel, Device } from 'zigbee-service';
import { DeviceService } from '../zigbee/device/device.service';
import { ApiActionDto } from './api.action.dto';
import { EventService, EventItem } from 'src/event/event.service';
export declare class ApiController {
    private readonly deviceService;
    private readonly eventService;
    constructor(deviceService: DeviceService, eventService: EventService);
    getDevices(): Device[];
    getDevice(addr: string): DeviceModel;
    sendAction(addr: string, action: ApiActionDto): Promise<any>;
    getEvents(): EventItem[];
}
