import { Query, Resolver, Args } from '@nestjs/graphql';
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

    @Query()
    device(@Args('addr') addr: string): Device {
      return this.deviceService.getDevice(addr);
    }
}

// {
//     getDevices {
//       type
//       ieeeAddr
//       manufName
//       modelId
//     }
//     device (addr: "0xd0cf5efffe3070a1") {
//       type
//       ieeeAddr
//       manufName
//       modelId
//     }
//   }
