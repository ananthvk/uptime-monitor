import { Module } from '@nestjs/common';
import { QueueModule } from 'src/queue/queue.module';
import { HeartbeatConsumer } from './heartbeat.consumer';
import { HeartbeatService } from './heartbeat.service';

@Module({
    imports: [QueueModule],
    providers: [HeartbeatConsumer, HeartbeatService],
    exports: [HeartbeatService]
})
export class HeartbeatModule { }
