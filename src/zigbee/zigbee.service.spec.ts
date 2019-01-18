import { Test, TestingModule } from '@nestjs/testing';
import { ZigbeeService } from './zigbee.service';

describe('ZigbeeService', () => {
  let service: ZigbeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZigbeeService],
    }).compile();

    service = module.get<ZigbeeService>(ZigbeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
