import { Controller, Get, Param, Post, Body, Inject } from '@nestjs/common';
import { DeviceModel, Device, ZigbeeAndDevice } from 'zigbee-service';
import { ApiOkResponse } from '@nestjs/swagger';

import { ApiActionDto } from './api.action.dto';
import { EventService, EventItem } from 'src/event/event.service';

@Controller('api')
export class ApiController {
    constructor(
        @Inject('ZigbeeService') private readonly znd: ZigbeeAndDevice,
        private readonly eventService: EventService,
    ) {}

    @ApiOkResponse({ description: 'Get the list of registered devices.'})
    @Get('devices')
    getDevices(): Device[] {
        return this.znd.device.getDevices();
    }

    @ApiOkResponse({ description: 'Get device details.'})
    @Get('devices/:addr')
    getDevice(@Param('addr') addr: string): DeviceModel {
        return this.znd.device.getMappedModel(addr);
    }

    @ApiOkResponse({ description: 'Send action to device.'})
    @Post('devices/:addr/action')
    sendAction(@Param('addr') addr: string, @Body() action: ApiActionDto): Promise<any> {
        return this.znd.device.sendAction({ ...action, addr });
    }

    @ApiOkResponse({ description: 'Get the list of events.'})
    @Get('events')
    getEvents(): EventItem[] {
        return this.eventService.get();
    }

    // http://127.0.0.1:3000/api/devices/0xd0cf5efffe3070a1/state/genOnOff/onOff
    @ApiOkResponse({ description: 'Get the state of device attribute.'})
    @Get('devices/:addr/state/:cId/:attrId')
    getState(@Param('addr') addr: string, @Param('cId') cId: string, @Param('attrId') attrId: string) {
        return this.znd.device.getState(addr, cId, attrId);
    }
}
