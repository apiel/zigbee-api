import { Query, Resolver, Args, Mutation, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { eventType, Device, ZigbeeAndDevice } from 'zigbee-service';
import { Inject } from '@nestjs/common';

import { EventService } from 'src/event/event.service';
import { EventItem, DeviceConfig } from 'src/types/graphql.schema';

const pubSub = new PubSub();

@Resolver('Graphql')
export class GraphqlResolver {
    constructor(
        @Inject('ZigbeeService') private readonly znd: ZigbeeAndDevice,
        private readonly eventService: EventService,
    ) {
        znd.zigbee.on(eventType.indMessage, this.onEvent(eventType.indMessage));
        znd.zigbee.on(eventType.devIncoming, this.onEvent(eventType.devIncoming));
        znd.zigbee.on(eventType.afIncomingMsg, this.onEvent(eventType.afIncomingMsg));
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
        return this.znd.device.getDevices();
    }

    @Query()
    device(@Args('addr') addr: string): Device {
      return this.znd.device.getDevice(addr);
    }

    @Query()
    getState(
        @Args('addr') addr: string,
        @Args('cId') cId: string,
        @Args('attrId') attrId: string,
    ): Promise<JSON> {
      return this.znd.device.getState(addr, cId, attrId);
    }

    @Query()
    getDeviceConfig(@Args('addr') addr: string): DeviceConfig {
      const mappedModel = this.znd.device.getMappedModel(addr);
      return {
          device: mappedModel.device,
          config: mappedModel.mappedModel,
      };
    }

    @Query()
    getEvents(): EventItem[] {
        return this.eventService.get().map(item => ({
            ...item,
            payload: item.payload,
            time: item.time.toString(),
        }));
    }

    @Mutation()
    async sendAction(@Args('addr') addr: string, @Args('action') action: any): Promise<string> {
        const response = await this.znd.device.sendAction({ ...action, addr });
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
//     getState (addr: "0xd0cf5efffe3070a1", cId: "genOnOff", attrId: "onOff")
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
