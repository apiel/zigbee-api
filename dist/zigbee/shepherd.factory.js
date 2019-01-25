"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zigbee_service_1 = require("zigbee-service");
const config_service_1 = require("../config/config.service");
const common_1 = require("@nestjs/common");
exports.shepherdFactory = {
    provide: 'Shepherd',
    inject: [config_service_1.ConfigService],
    useFactory: (config) => {
        const logger = new common_1.Logger('shepherdFactory');
        const SERIAL_PATH = config.get('SERIAL_PATH');
        const ZIGBEE_PERMIT_JOIN = parseInt(config.get('ZIGBEE_PERMIT_JOIN'), 10);
        const shepherdConfig = {
            SERIAL_PATH,
            ZIGBEE_PERMIT_JOIN,
        };
        return zigbee_service_1.useFactory(shepherdConfig, logger);
    },
};
//# sourceMappingURL=shepherd.factory.js.map