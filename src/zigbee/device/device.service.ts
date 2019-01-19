import { Injectable, Logger, Inject } from '@nestjs/common';
import * as zShepherdConverters from 'zigbee-shepherd-converters';

import { Shepherd } from '../shepherd.factory';
import { DeviceNotFound } from './device.error';

// export type Device = any;
export interface Device {
    type: string;
    ieeeAddr: string;
    nwkAddr: number;
    manufId: number;
    manufName: string;
    powerSource: string;
    modelId: string;
    epList: number[];
    status: string;
    joinTime: number;
}

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

    sendAction({ addr, action, type = 'set' }: Action): Promise<any> {
        const { device, mappedModel, epId } = this.getMappedModel(addr);
        return Promise.all(
            Object.keys(action).map((key) => {
                const converter = mappedModel.toZigbee.find((c) => c.key.includes(key));
                if (!converter) {
                    throw new Error(`No converter available for '${key}' (${action[key]})`);
                }
                const message = converter.convert(key, action[key], action, type); // we might have to handle null as message
                if (!message) {
                    throw new Error('No message available to send action');
                }
                return this.sendMessage(device, epId, message);
            }),
        );
    }

    sendMessage(device: Device, epId: number, message: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const callback = (error: Error, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            };
            const ep = this.shepherd.find(device.ieeeAddr, epId);
            if (message.cmdType === 'functional') {
                ep.functional(message.cid, message.cmd, message.zclData, callback);
            } else if (message.cmdType === 'foundation') {
                ep.foundation(message.cid, message.cmd, [message.zclData], callback);
            } else {
                reject(`Unknown zigbee publish type ${message.type}`);
            }
        });
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
