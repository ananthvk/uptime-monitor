import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
@Processor('heartbeat')
export class HeartbeatConsumer extends WorkerHost {
    constructor(@InjectQueue('heartbeat') private readonly queue: Queue) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        this.queue.removeJobScheduler(job.repeatJobKey!)
        // console.log(job.name, job.id)
        if (job.name === 'check_heartbeat') {
            const data: any = job.data
            if (data.type === 'HTTP') {
                const response = await fetch(data.url)
                console.log(response.status)
            }
        }
    }
}
