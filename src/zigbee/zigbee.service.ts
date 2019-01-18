import { Injectable, Inject, Logger } from '@nestjs/common';
import { Shepherd } from './shepherd.factory';

@Injectable()
export class ZigbeeService {
    private readonly logger = new Logger(ZigbeeService.name);

    constructor(@Inject('Shepherd') private shepherd: Shepherd) {
        // console.log('Shepherd', shepherd.acceptDevIncoming);
        // console.log('Shepherd', shepherd.controller);
        shepherd.start(this.start);
        shepherd.on('error', this.error);
    }

    start = async (error: Error) => {
        if (error) {
            this.logger.error('Error when starting zigbee service. Exit process!', JSON.stringify(error));
            process.exit();
        }
        this.logger.log('Start zigbee');

        // now attachDevices
        const devices = this.shepherd.list().filter((device: any) => device.type !== 'Coordinator');
        this.logger.log(`Zigbee devices: ${JSON.stringify(devices, null, 4)}`);

        // devices.forEach((device) => {
        //     attachDevice(device);
        // });
    }

    error = (error: Error) => {
        this.logger.error(error);
    }
}
