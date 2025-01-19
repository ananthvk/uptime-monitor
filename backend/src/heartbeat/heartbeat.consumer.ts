import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
@Processor('heartbeat')
export class HeartbeatConsumer extends WorkerHost{
    async process(job: Job<any, any, string>): Promise<any> {
        console.log(job.name)
    }
}
