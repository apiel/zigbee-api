import { ZigbeeService } from './zigbee/zigbee.service';
export declare class AppService {
    private zigbeeService;
    constructor(zigbeeService: ZigbeeService);
    getHello(): string;
}
