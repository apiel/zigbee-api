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

export abstract class IQuery {
    abstract getDevices(): Device[] | Promise<Device[]>;
    abstract temp__(): boolean | Promise<boolean>;
}
