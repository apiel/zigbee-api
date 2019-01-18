import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        const env = process.env.NODE_ENV || 'development';
        const filePath: string = `${__dirname}/../../config/${env}.env`;
        this.envConfig = parse(readFileSync(filePath));
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}
