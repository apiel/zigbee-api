import { Injectable, Inject, Logger } from '@nestjs/common';
import * as zShepherdConverters from 'zigbee-shepherd-converters';
import { get } from 'lodash';

import { Shepherd } from './shepherd.factory';

type Device = any;

@Injectable()
export class ZigbeeService {
    private readonly logger = new Logger(ZigbeeService.name);

    constructor(@Inject('Shepherd') private shepherd: Shepherd) {
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

        const devices = this.getDevices();
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

        if (message.type === 'devIncoming') {
            this.devIncoming(message);
        } else if (message.type === 'attReport') {
            this.loadMessage(message);
        }
    }

    getDevices() {
        return this.shepherd.list().filter((device: any) => device.type !== 'Coordinator');
    }

    protected devIncoming(message: any) {
        const device: Device = get(message, 'endpoints[0].device');
        if (device) {
            const ieeeAddr = device.ieeeAddr;
            this.logger.log(`devIncoming, new device ${ieeeAddr}`);
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
                const payload = converter.convert(mappedModel, message, null, device);
                // ToDO
                // onIndMessage(device, payload, cid || cmdId);
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

    // might move all the following code to DeviceService

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
