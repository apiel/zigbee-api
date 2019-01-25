import { useFactory, Shepherd, ShepherdConfig } from 'zigbee-service';

import { ConfigService } from '../config/config.service';
import { Logger } from '@nestjs/common';

export const shepherdFactory = {
    provide: 'Shepherd',
    inject: [ConfigService],
    useFactory: (config: ConfigService): Shepherd => {
        const logger = new Logger('shepherdFactory');
        const SERIAL_PATH = config.get('SERIAL_PATH');
        const ZIGBEE_PERMIT_JOIN = parseInt(config.get('ZIGBEE_PERMIT_JOIN'), 10);

        const shepherdConfig: ShepherdConfig = {
            SERIAL_PATH,
            ZIGBEE_PERMIT_JOIN,
        };
        return useFactory(shepherdConfig, logger);
    },
};
