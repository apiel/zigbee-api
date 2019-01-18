import { Injectable, Logger, Inject } from '@nestjs/common';
import * as zShepherdConverters from 'zigbee-shepherd-converters';

import { Shepherd } from '../shepherd.factory';

export type Device = any;

@Injectable()
export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);

    constructor(@Inject('Shepherd') private shepherd: Shepherd) {}

    getDevices() {
        return this.shepherd.list().filter((device: any) => device.type !== 'Coordinator');
    }

    sendAction(addr: string, action: any, type = 'set') {
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

    sendMessage(device: Device, epId: number, message: any) { // we could use promise instead
        const callback = (error: Error, rsp: any) => {
            // console.log('change state done', rsp, 'with error:', error);
            if (error) {
                this.logger.error(error);
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

    protected getMappedModel(addr: string) {
        const { device, epId } = this.getEndPoint(addr);
        const mappedModel = zShepherdConverters.findByZigbeeModel(device.modelId);
        if (!mappedModel) {
            this.logger.warn('No model found');
            return;
        }
        return { device, mappedModel, epId };
    }

    getEndPoint(addr: string) {
        const device = this.getDevice(addr);
        const epId = device.epList[0];
        return {device, epId };
    }

    getDevice(addr: string) {
        const device = this.shepherd.list().find((d: Device) => d.ieeeAddr === addr);
        if (!device) {
            throw new Error(`Failed to find device with deviceID ${addr}`);
        }
        return device;
    }
}
