import { Query, Resolver, Args, Mutation, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { DeviceService, Device } from 'src/zigbee/device/device.service';
import { EventService } from 'src/event/event.service';
// import { EventItem, DeviceConfig } from 'types/graphql.schema';
import { ZigbeeService, eventType } from 'src/zigbee/zigbee.service';

const pubSub = new PubSub();

@Resolver('Graphql')
export class GraphqlResolver {
    constructor(
        private readonly deviceService: DeviceService,
        private readonly eventService: EventService,
        private readonly zigbeeService: ZigbeeService,
    ) {
        zigbeeService.on(eventType.indMessage, this.onEvent(eventType.indMessage));
        zigbeeService.on(eventType.devIncoming, this.onEvent(eventType.devIncoming));
        zigbeeService.on(eventType.afIncomingMsg, this.onEvent(eventType.afIncomingMsg));
    }

    onEvent = (type: string) => (payload: any) => {
        const events = {
            type,
            payload,
            time: (new Date()).toString(),
        };
        pubSub.publish('events', { events });
    }

    @Query()
    getDevices(): Device[] {
        return this.deviceService.getDevices();
    }

    @Query()
    device(@Args('addr') addr: string): Device {
      return this.deviceService.getDevice(addr);
    }

    @Query()
    getDeviceConfig(@Args('addr') addr: string) /*: DeviceConfig*/ {
      const mappedModel = this.deviceService.getMappedModel(addr);
      return {
          device: mappedModel.device,
          config: mappedModel.mappedModel,
      };
    }

    @Query()
    getEvents() /*: EventItem[]*/ {
        return this.eventService.get().map(item => ({
            ...item,
            payload: item.payload,
            time: item.time.toString(),
        }));
    }

    @Mutation()
    async sendAction(@Args('addr') addr: string, @Args('action') action: any): Promise<string> {
        const response = await this.deviceService.sendAction({ ...action, addr });
        return response;
    }

    @Subscription()
    events() {
        return {
            subscribe: () => pubSub.asyncIterator('events'),
        };
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

// subscription {
//     events {
//       type
//       payload
//       time
//     }
//   }

//   {
//     getDeviceConfig(addr: "0xd0cf5efffe3070a1") {
//       device {
//         type
//         ieeeAddr
//         modelId
//       }
//       config
//     }
//   }
