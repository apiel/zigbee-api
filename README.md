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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Supported devices
See [Supported devices](https://koenkk.github.io/zigbee2mqtt/information/supported_devices.html) on Zigbee2mqtt documentation to check whether your device is supported. There is quite an extensive list, including devices from vendors like Xiaomi, Ikea, Philips, OSRAM and more.

## License

zigbee-api is [MIT licensed](LICENSE).
