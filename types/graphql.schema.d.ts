/* tslint:disable */
export class Device {
    type?: string;
    ieeeAddr?: string;
    nwkAddr?: number;
    manufId?: number;
    manufName?: string;
    powerSource?: string;
    modelId?: string;
    epList?: number[];
    status?: string;
    joinTime?: number;
}

export class DeviceConfig {
    device?: Device;
    config?: string;
}

export class EventItem {
    type?: string;
    payload?: string;
    time?: string;
}

export abstract class IMutation {
    abstract sendAction(addr: string, action: string): string | Promise<string>;
}

export abstract class IQuery {
    abstract getDevices(): Device[] | Promise<Device[]>;
    abstract device(addr: string): Device | Promise<Device>;
    abstract getDeviceConfig(addr: string): DeviceConfig | Promise<DeviceConfig>;
    abstract getEvents(): EventItem[] | Promise<EventItem[]>;
    abstract temp__(): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract events(): EventItem | Promise<EventItem>;
}
