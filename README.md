<div align="center">
    <h1>zigbee-api</h1>
    <p>
        Allows you to use your Zigbee devices <b>without</b> the vendors bridge or gateway.
    </p>
    <p>
        It bridges events and allows you to control your Zigbee devices via API. In this way you can integrate your Zigbee devices with whatever smart home infrastructure you are using.
    </p>
</div>

## Description

Zigbee API base on [Nest](https://github.com/nestjs/nest) framework inspired by [zigbee2mqtt](https://github.com/Koenkk/zigbee2mqtt).

## Supported devices
See [Supported devices](https://koenkk.github.io/zigbee2mqtt/information/supported_devices.html) on Zigbee2mqtt documentation to check whether your device is supported. There is quite an extensive list, including devices from vendors like Xiaomi, Ikea, Philips, OSRAM and more.

## Installation

```bash
$ git clone https://github.com/apiel/zigbee-api.git
$ cd zigbee-api
$ npm install
```

## Getting started

The [documentation from zigbee2mqtt](https://koenkk.github.io/zigbee2mqtt/) provides you all the information needed to get up and running! Make sure you don't skip sections if this is your first visit, as there might be important details in there for you.

If you aren't familiar with **Zigbee** terminology make sure you [read this](https://koenkk.github.io/zigbee2mqtt/information/zigbee_network.html) to help you out.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## REST API

- `GET /api/devices` Get the list of registered devices.
- `GET /api/devices/{addr}` Get the details of a device, where `addr` is the address of the device, for example `0xd0cf5efffe3070a1`.
- `GET /api/events` Get the list of events from the last 5 minutes, for example new device incoming or messages receive from a remote.
- `POST /api/devices/{addr}/action` Send an action to a device, where `addr` is the address of the device and the request body should contain the command in JSON format, for example `{ "action": { "state": "on" }, "type": "set" }`

**Build-in documentation**

There is build-in documentation, using standard OpenAPI Specification. To access it, go to the url http://127.0.0.1:3000/docs . 

![swagger documentation](https://raw.githubusercontent.com/apiel/zigbee-api/master/docs/images/swagger.png)

From this user interface, you can run some test queries, for example to change the state of a device:

![swagger tryout](https://raw.githubusercontent.com/apiel/zigbee-api/master/docs/images/swagger_tryout.png)

## GraphQL

You can access the GraphQL playground under the url http://127.0.0.1:3000/graphql 

![graphql playground](https://raw.githubusercontent.com/apiel/zigbee-api/master/docs/images/graphql_playground.png)

From there you can try your GraphQL queries:

- to get the list of devices

```
{
    getDevices {
      type
      ieeeAddr
      manufName
      modelId
    }
}
```

- to get a single device information

```
{
    device (addr: "0xd0cf5efffe3070a1") {
      type
      ieeeAddr
      manufName
      modelId
    }
}
```

- to get device config information
```
{
  getDeviceConfig(addr: "0xd0cf5efffe3070a1") {
    device {
      type
      ieeeAddr
      modelId
    }
    config
  }
}
```

- to get the list of events from the last 5 minutes

```
{
    getEvents {
      type
      payload
      time
    }
}
```

- to send an action to a device

```
mutation {
    sendAction(
        addr: "0xd0cf5efffe3070a1"
        action: "{\"action\": {\"state\": \"on\"}, \"type\": \"set\"}"
    )
}
```

It is also possible to have real-time subscription, to receive events:

```
subscription {
    events {
      type
      payload
      time
    }
  }
```

Read more about the GraphqQL subscriptions [here](https://www.apollographql.com/docs/graphql-subscriptions/).

## Microservice

Nest framework provide a micro-servive interface. It provide multiple communication protocole like TCP, MQTT, AMQP with RabbitMQ, Redis pub/sub... For more information look at the [nest documentation](https://docs.nestjs.com/microservices/basics).
