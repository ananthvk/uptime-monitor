import { Module } from '@nestjs/common';
import { QueueModule } from 'src/queue/queue.module';
import { HeartbeatConsumer } from './heartbeat.consumer';

@Module({
    imports: [QueueModule],
    providers: [HeartbeatConsumer]
})
export class HeartbeatModule { }
