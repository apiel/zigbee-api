/// <reference types="node" />
import { ZigbeeService } from 'src/zigbee/zigbee.service';
export interface EventItem {
    type: string;
    payload: any;
    time: Date;
}
export declare class EventService {
    list: EventItem[];
    timerClean: NodeJS.Timeout;
    constructor(zigbeeService: ZigbeeService);
    onEvent: (type: string) => (payload: any) => void;
    get(): EventItem[];
    clean: () => void;
    protected isLessThan5MinOld(item: EventItem): boolean;
}
