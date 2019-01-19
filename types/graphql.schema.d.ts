/* tslint:disable */
export class Cat {
    id?: number;
    name?: string;
    age?: number;
}

export class Device {
    ieeeAddr?: string;
}

export abstract class IQuery {
    abstract getCats(): Cat[] | Promise<Cat[]>;
    abstract devices(): Device[] | Promise<Device[]>;
    abstract temp__(): boolean | Promise<boolean>;
}
