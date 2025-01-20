import { Test, TestingModule } from '@nestjs/testing';
import { HeartbeatConsumer } from './heartbeat.consumer';

describe('HeartbeatConsumer', () => {
  let service: HeartbeatConsumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeartbeatConsumer],
    }).compile();

    service = module.get<HeartbeatConsumer>(HeartbeatConsumer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
