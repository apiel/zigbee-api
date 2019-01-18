import { Injectable, Inject, Logger } from '@nestjs/common';
import * as zShepherdConverters from 'zigbee-shepherd-converters';
import { get } from 'lodash';

import { Shepherd } from './shepherd.factory';

type Device = any;

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
        const devices = this.getDevices();
        this.logger.log(`Zigbee devices: ${JSON.stringify(devices, null, 4)}`);

        devices.forEach((device: Device) => {
            this.attachDevice(device);
        });
    }

    error = (error: Error) => {
        this.logger.error(error);
    }

    onInd = (message: any) => {
        // console.log('ind', message);
        this.logger.log(`> ind: ${message.type}`);

        if (message.type === 'devIncoming') {
            const device: Device = message.endpoints[0].device;
            const ieeeAddr = device.ieeeAddr;

            this.logger.log(`devIncoming, new device ${ieeeAddr}`);
            this.attachDevice(device);
        } else if (message.type === 'attReport') {
            this.loadMessage(message);
        }
    }

    getDevices() {
        return this.shepherd.list().filter((device: any) => device.type !== 'Coordinator');
    }

    loadMessage(message: any) {
        const device = get(message, 'endpoints[0].device');
        const cid = get(message, 'data.cid');
        const cmdId = get(message, 'data.cmdId');
        if (device && (cid || cmdId)) {
            const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
            const converters = mappedModel.fromZigbee.filter((c: any) => {
                if (cid) {
                    return c.cid === cid && c.type === message.type;
                } else if (cmdId) {
                    return c.cmd === cmdId;
                }
                return false;
            });
            converters.forEach((converter: any) => {
                const payload = converter.convert(mappedModel, message, null, device);
                // ToDO
                // onIndMessage(device, payload, cid || cmdId);
            });
        }
    }

    attachDevice(device: Device) {
        const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
        if (mappedModel) {
            if (mappedModel.configure) {
                mappedModel.configure(
                    device.ieeeAddr,
                    this.shepherd,
                    this.getCoordinator(),
                    (ok: boolean) => {
                        const result = ok ? 'Succeed' : 'Failed';
                        this.logger.log(`${result} to configure ${mappedModel.description} ${device.ieeeAddr}`);
                    },
                );
            }
            if (mappedModel.onAfIncomingMsg) {
                // ToDo
                // mappedModel.onAfIncomingMsg.forEach((epId) => registerOnAfIncomingMsg(device.ieeeAddr, epId));
            }
        }
    }

    getCoordinator() {
        const device = this.shepherd.list().find((d: Device) => d.type === 'Coordinator');
        return this.shepherd.find(device.ieeeAddr, 1);
    }
}
