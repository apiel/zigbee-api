import { ConfigService } from '../config/config.service';

export interface Shepherd {
    hello: string;
}

export const shepherdFactory = {
    provide: 'Shepherd',
    inject: [ConfigService],
    useFactory: (config: ConfigService): Shepherd => {
        const path = config.get('SERIAL_PATH');
        console.log('the path', path);
        return {
            hello: 'abc',
        };
    },
};
