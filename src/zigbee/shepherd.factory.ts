import { useFactory, Shepherd, ShepherdConfig } from 'zigbee-service';

import { ConfigService } from '../config/config.service';
import { Logger } from '@nestjs/common';

export const shepherdFactory = {
    provide: 'Shepherd',
    inject: [ConfigService],
    useFactory: (config: ConfigService): Shepherd => {
        const logger = new Logger('shepherdFactory');
        const DB_PATH = `${__dirname}/../../data/zigbee.db`;
        const SERIAL_PATH = config.get('SERIAL_PATH');
        const ZIGBEE_PERMIT_JOIN = parseInt(config.get('ZIGBEE_PERMIT_JOIN'), 10);

        const shepherdConfig: ShepherdConfig = {
            DB_PATH,
            SERIAL_PATH,
            ZIGBEE_PERMIT_JOIN,
        };
        return useFactory(shepherdConfig, logger);
    },
};
