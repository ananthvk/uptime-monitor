import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { HeartbeatModule } from 'src/heartbeat/heartbeat.module';

@Module({
    imports: [HeartbeatModule],
    controllers: [MonitorController],
    providers: [MonitorService]
})
export class MonitorModule { }
