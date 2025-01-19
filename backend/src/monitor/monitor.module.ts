import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
    imports: [QueueModule],
    controllers: [MonitorController],
    providers: [MonitorService]
})
export class MonitorModule { }
