import { Injectable, Logger, Inject } from '@nestjs/common';
import * as zShepherdConverters from 'zigbee-shepherd-converters';

import { Shepherd } from '../shepherd.factory';
import { DeviceNotFound } from './device.error';

export type Device = any;

export interface DeviceEndPoint {
    device: Device;
    epId: number;
}

export interface DeviceModel extends DeviceEndPoint {
    mappedModel: any;
}

export interface Action {
    addr: string;
    action: any;
    type: 'set' | 'get';
}

@Injectable()
export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);

    constructor(@Inject('Shepherd') private shepherd: Shepherd) {}

    getDevices() {
        return this.shepherd.list().filter((device: any) => device.type !== 'Coordinator');
    }

    getDevice(addr: string) {
        const device = this.shepherd.list().find((d: Device) => d.ieeeAddr === addr);
        if (!device) {
            throw new DeviceNotFound(`Failed to find device with ID ${addr}`);
        }
        return device;
    }

    sendAction({ addr, action, type = 'set' }: Action) {
        const { device, mappedModel, epId } = this.getMappedModel(addr);
        Object.keys(action).forEach((key) => {
            const converter = mappedModel.toZigbee.find((c) => c.key.includes(key));
            if (!converter) {
                this.logger.log(`No converter available for '${key}' (${action[key]})`, mappedModel.toZigbee);
                return;
            }
            const message = converter.convert(key, action[key], action, type); // we might have to handle null as message
            if (!message) {
                this.logger.warn('No message');
                return;
            }
            this.sendMessage(device, epId, message);
        });
    }

    // Need to transform this in promise
    sendMessage(device: Device, epId: number, message: any) {
        const callback = (error: Error, rsp: any) => {
            console.log('change state done', rsp, 'with error:', error);
            if (error) {
                this.logger.error(error.message);
            } else {
                this.logger.log('change state done');
            }
        };
        const ep = this.shepherd.find(device.ieeeAddr, epId);
        if (message.cmdType === 'functional') {
            ep.functional(message.cid, message.cmd, message.zclData, callback);
        } else if (message.cmdType === 'foundation') {
            ep.foundation(message.cid, message.cmd, [message.zclData], callback);
        } else {
            this.logger.error(`Unknown zigbee publish type ${message.type}`);
        }
    }

    getMappedModel(addr: string): DeviceModel {
        const { device, epId } = this.getEndPoint(addr);
        const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
        if (!mappedModel) {
            this.logger.warn('No model found');
            return;
        }
        return { device, mappedModel, epId };
    }

    getEndPoint(addr: string): DeviceEndPoint {
        const device = this.getDevice(addr);
        const epId = device.epList[0];
        return {device, epId };
    }
}
