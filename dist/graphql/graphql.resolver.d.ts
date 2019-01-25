import { Device } from 'zigbee-service';
import { DeviceService } from 'src/zigbee/device/device.service';
import { EventService } from 'src/event/event.service';
import { EventItem, DeviceConfig } from 'src/types/graphql.schema';
import { ZigbeeService } from 'src/zigbee/zigbee.service';
export declare class GraphqlResolver {
    private readonly deviceService;
    private readonly eventService;
    constructor(deviceService: DeviceService, eventService: EventService, zigbeeService: ZigbeeService);
    onEvent: (type: string) => (payload: any) => void;
    getDevices(): Device[];
    device(addr: string): Device;
    getDeviceConfig(addr: string): DeviceConfig;
    getEvents(): EventItem[];
    sendAction(addr: string, action: any): Promise<string>;
    events(): {
        subscribe: () => any;
    };
}
