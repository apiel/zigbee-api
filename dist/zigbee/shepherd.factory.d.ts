import { Shepherd } from 'zigbee-service';
import { ConfigService } from '../config/config.service';
export declare const shepherdFactory: {
    provide: string;
    inject: (typeof ConfigService)[];
    useFactory: (config: ConfigService) => Shepherd;
};
