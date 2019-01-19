import { Injectable, Inject, Logger } from '@nestjs/common';
import * as zShepherdConverters from 'zigbee-shepherd-converters';
import { get } from 'lodash';
import { EventEmitter } from 'events';

import { Shepherd } from './shepherd.factory';
import { Device, DeviceService } from './device/device.service';

export const messageType = {
    devIncoming: 'devIncoming',
    attReport: 'attReport',
};

export const eventType = {
    devIncoming: messageType.devIncoming,
    ind: 'ind',
    indMessage: 'indMessage',
};

@Injectable()
export class ZigbeeService extends EventEmitter {
    private readonly logger = new Logger(ZigbeeService.name);

    constructor(
        @Inject('Shepherd') private shepherd: Shepherd,
        private deviceService: DeviceService,
    ) {
        super();
        shepherd.start(this.start);
        shepherd.on('error', this.error);
        shepherd.on('ind', this.onInd);
    }

    protected start = async (error: Error) => {
        if (error) {
            this.logger.error('Error when starting zigbee service. Exit process!', JSON.stringify(error));
            process.exit();
        }
        this.logger.log('Start zigbee');

        const devices = this.deviceService.getDevices();
        this.logger.log(`Zigbee devices: ${JSON.stringify(devices, null, 4)}`);

        devices.forEach((device: Device) => {
            this.attachDevice(device);
        });
    }

    protected error = (error: Error) => {
        this.logger.error(error);
    }

    protected onInd = (message: any) => {
        this.logger.log(`> ind: ${message.type}`);
        this.emit(eventType.ind, message);

        if (message.type === messageType.devIncoming) {
            this.devIncoming(message);
        } else if (message.type === messageType.attReport) {
            this.loadMessage(message);
        }
    }

    protected devIncoming(message: any) {
        const device: Device = get(message, 'endpoints[0].device');
        if (device) {
            const addr = device.ieeeAddr;
            this.logger.log(`devIncoming, new device ${addr}`);
            this.emit(eventType.devIncoming, { addr });
            this.attachDevice(device);
        } else {
            this.logger.error('devIncoming without device');
        }
    }

    protected loadMessage(message: any) {
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
                const data = converter.convert(mappedModel, message, null, device);
                const cmd = cid || cmdId;
                // ToDO
                // onIndMessage(device, data, cmd);
                this.emit(eventType.indMessage, { data, cmd });
            });
        }
    }

    protected attachDevice(device: Device) {
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
