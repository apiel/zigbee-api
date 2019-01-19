import { Injectable } from '@nestjs/common';
import { ZigbeeService, eventType } from 'src/zigbee/zigbee.service';

export interface ListItem {
    type: string;
    payload: any;
    time: Date;
}

const FIVE_MIN = 5 * 60 * 1000;

@Injectable()
export class EventService {
    list: ListItem[] = [];

    timerClean: NodeJS.Timeout;

    constructor(private readonly zigbeeService: ZigbeeService) {
        // zigbeeService.on(eventType.ind, console.log);
        zigbeeService.on(eventType.indMessage, this.onEvent(eventType.indMessage));
        zigbeeService.on(eventType.devIncoming, this.onEvent(eventType.devIncoming));
        zigbeeService.on(eventType.afIncomingMsg, this.onEvent(eventType.afIncomingMsg));
    }

    onEvent = (type: string) => (payload: any) => {
        const time = new Date();
        this.list.push({ type, payload, time });
        this.timerClean = setTimeout(this.clean, 100);
    }

    get(): ListItem[] {
        this.clean();
        return this.list;
    }

    clean = (): void => {
        this.list = this.list.filter((item: ListItem) => this.isLessThan5MinOld(item));
    }

    protected isLessThan5MinOld(item: ListItem): boolean {
        const now: any = new Date();
        const time: any = item.time;
        const duration = now - time;
        return duration < FIVE_MIN;
    }
}
