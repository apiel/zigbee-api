/* tslint:disable */
export class Device {
    ieeeAddr?: string;
}

export abstract class IQuery {
    abstract devices(): Device[] | Promise<Device[]>;
    abstract temp__(): boolean | Promise<boolean>;
}
