import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { DeviceService, Device } from 'src/zigbee/device/device.service';
import { EventService } from 'src/event/event.service';
import { EventItem } from 'types/graphql.schema';

@Resolver('Graphql')
export class GraphqlResolver {
    constructor(
        private readonly deviceService: DeviceService,
        private readonly eventService: EventService,
    ) {}

    @Query()
    getDevices(): Device[] {
        return this.deviceService.getDevices();
    }

    @Query()
    device(@Args('addr') addr: string): Device {
      return this.deviceService.getDevice(addr);
    }

    @Query()
    getEvents(): EventItem[] {
        return this.eventService.get().map(item => ({
            ...item,
            payload: JSON.stringify(item.payload),
            time: item.time.toString(),
        }));
    }

    @Mutation()
    async sendAction(@Args('addr') addr: string, @Args('action') action: string): Promise<string> {
        const data = JSON.parse(action);
        const response = await this.deviceService.sendAction({ ...data, addr });
        return JSON.stringify(response);
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
//     getEvents {
//       type
//       payload
//       time
//     }
//   }

// mutation {
//     sendAction(
//       addr: "0xd0cf5efffe3070a1"
//       action: "{\"action\": {\"state\": \"on\"}, \"type\": \"set\"}"
//     )
//   }
