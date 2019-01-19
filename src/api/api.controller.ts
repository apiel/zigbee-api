import { Controller, Get, Param, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { DeviceService, Device, DeviceModel } from '../zigbee/device/device.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiActionDto } from './api.action.dto';
import { EventService, EventItem } from 'src/event/event.service';

@Controller('api')
export class ApiController {
    constructor(
        private readonly deviceService: DeviceService,
        private readonly eventService: EventService,
    ) {}

    @ApiOkResponse({ description: 'Get the list of registered devices.'})
    @Get('devices')
    getDevices(): Device[] {
        return this.deviceService.getDevices();
    }

    @ApiOkResponse({ description: 'Get device details.'})
    @Get('devices/:addr')
    getDevice(@Param('addr') addr: string): DeviceModel {
        return this.deviceService.getMappedModel(addr);
    }

    @ApiOkResponse({ description: 'Send action to device.'})
    @Post('devices/:addr/action')
    sendAction(@Param('addr') addr: string, @Body() action: ApiActionDto): Promise<any> {
        return this.deviceService.sendAction({ ...action, addr });
    }

    @ApiOkResponse({ description: 'Get the list of events.'})
    @Get('events')
    getEvents(): EventItem[] {
        return this.eventService.get();
    }
}
