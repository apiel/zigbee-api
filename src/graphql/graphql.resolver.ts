import { Query, Resolver } from '@nestjs/graphql';
import { DeviceService, Device } from 'src/zigbee/device/device.service';

@Resolver('Graphql')
export class GraphqlResolver {
    constructor(
        private readonly deviceService: DeviceService,
    ) {}

    @Query()
    getDevices(): Device[] {
        return this.deviceService.getDevices();
    }
}
