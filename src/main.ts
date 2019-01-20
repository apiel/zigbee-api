import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/common/enums/transport.enum';

import { AppModule } from './app.module';
import { Logger, INestApplication } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Zigbee API')
        .setDescription('It bridges events and allows you to control your Zigbee devices via API.')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3000);

    // startMicroservice(app);
}
bootstrap();

function startMicroservice(app: INestApplication) {
    const microservice = app.connectMicroservice({
        transport: Transport.MQTT,
        options: {
            host: 'localhost',
            port: 1883,
        },
    });
    microservice.listen(() => Logger.log('Microservice is listening'));
}
