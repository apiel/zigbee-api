import { Resolver } from '@nestjs/graphql';
import { DeviceService, Device } from 'src/zigbee/device/device.service';
import { Query } from '@nestjs/common';

@Resolver('Graphql')
export class GraphqlResolver {
    constructor(
        private readonly deviceService: DeviceService,
    ) {}

    @Query()
    devices(): Device[] {
        console.log('was bal');
        return this.deviceService.getDevices();
    }
}
