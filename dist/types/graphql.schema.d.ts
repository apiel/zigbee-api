export declare class Device {
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
export declare class DeviceConfig {
    device?: Device;
    config?: JSON;
}
export declare class EventItem {
    type?: string;
    payload?: JSON;
    time?: string;
}
export declare abstract class IMutation {
    abstract sendAction(addr: string, action: JSON): JSON | Promise<JSON>;
}
export declare abstract class IQuery {
    abstract getDevices(): Device[] | Promise<Device[]>;
    abstract device(addr: string): Device | Promise<Device>;
    abstract getDeviceConfig(addr: string): DeviceConfig | Promise<DeviceConfig>;
    abstract getEvents(): EventItem[] | Promise<EventItem[]>;
    abstract temp__(): boolean | Promise<boolean>;
}
export declare abstract class ISubscription {
    abstract events(): EventItem | Promise<EventItem>;
}
export declare type JSON = any;
