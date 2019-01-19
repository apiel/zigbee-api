import { Injectable } from '@nestjs/common';
import { ZigbeeService, eventType } from 'src/zigbee/zigbee.service';

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

    constructor(zigbeeService: ZigbeeService) {
        // zigbeeService.on(eventType.ind, console.log);
        zigbeeService.on(eventType.indMessage, this.onEvent(eventType.indMessage));
        zigbeeService.on(eventType.devIncoming, this.onEvent(eventType.devIncoming));
        zigbeeService.on(eventType.afIncomingMsg, this.onEvent(eventType.afIncomingMsg));

        this.onEvent('hello')({ world: 'abc' });
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
