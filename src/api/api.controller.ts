import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { DeviceService, Device, DeviceModel } from '../zigbee/device/device.service';
import { DeviceNotFound } from 'src/zigbee/device/device.error';

@Controller('api')
export class ApiController {
    constructor(private readonly deviceService: DeviceService) {}

    @Get('devices')
    getDevices(): Device[] {
        return this.deviceService.getDevices();
    }

    @Get('devices/:addr')
    getDevice(@Param('addr') addr: string): DeviceModel {
        return this.deviceService.getMappedModel(addr);
        // return this.deviceService.getDevice(addr);
    }
}
