import * as ZShepherd from 'zigbee-shepherd';

import { ConfigService } from '../config/config.service';
import { Logger } from '@nestjs/common';

export interface Shepherd {
    controller: any;
    acceptDevIncoming: () => void;
    start: any; // (callback: () => void) => void;
    on: any;
    list: any;
    find: any;
}

export const shepherdFactory = {
    provide: 'Shepherd',
    inject: [ConfigService],
    useFactory: (config: ConfigService): Shepherd => {
        const logger = new Logger('shepherdFactory');
        const path = config.get('SERIAL_PATH');
        const shepherd = new ZShepherd(path, {
            sp: { baudRate: 115200, rtscts: true },
            dbPath: `${__dirname}/../../data/zigbee.db`,
        });
        shepherd.on('ZNP:CLOSE', () => {
            logger.log('ZNP:CLOSE exit app!');
            process.exit();
        });
        return shepherd;
    },
};
