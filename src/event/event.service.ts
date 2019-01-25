import { Injectable, Inject } from '@nestjs/common';
import { eventType, ZigbeeAndDevice } from 'zigbee-service';

export interface EventItem {
    type: string;
    payload: any;
    time: Date;
}

const FIVE_MIN = 5 * 60 * 1000;

@Injectable()
export class EventService {
    list: EventItem[] = [];

    timerClean: NodeJS.Timeout;

    constructor(@Inject('ZigbeeService') znd: ZigbeeAndDevice) {
        // znd.zigbee.on(eventType.ind, console.log);
        znd.zigbee.on(eventType.indMessage, this.onEvent(eventType.indMessage));
        znd.zigbee.on(eventType.devIncoming, this.onEvent(eventType.devIncoming));
        znd.zigbee.on(eventType.afIncomingMsg, this.onEvent(eventType.afIncomingMsg));
        znd.zigbee.on(eventType.devices, this.onEvent(eventType.devices));
    }

    onEvent = (type: string) => (payload: any) => {
        const time = new Date();
        this.list.push({ type, payload, time });
        this.timerClean = setTimeout(this.clean, 100);
    }

    get(): EventItem[] {
        this.clean();
        return this.list;
    }

    clean = (): void => {
        this.list = this.list.filter((item: EventItem) => this.isLessThan5MinOld(item));
    }

    protected isLessThan5MinOld(item: EventItem): boolean {
        const now: any = new Date();
        const time: any = item.time;
        const duration = now - time;
        return duration < FIVE_MIN;
    }
}
