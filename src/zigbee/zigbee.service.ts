import { Injectable, Inject } from '@nestjs/common';
import { Shepherd } from './shepherd.factory';

@Injectable()
export class ZigbeeService {
    constructor(@Inject('Shepherd') shepherd: Shepherd) {
        console.log('Shepherd', shepherd);
    }
}
