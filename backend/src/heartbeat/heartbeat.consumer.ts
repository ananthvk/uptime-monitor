import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
@Processor('heartbeat')
export class HeartbeatConsumer extends WorkerHost {
    private readonly logger = new Logger(HeartbeatConsumer.name)
    constructor(@InjectQueue('heartbeat') private readonly queue: Queue) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        if (job.name === 'check_heartbeat') {
            const data: any = job.data
            if (data.type === 'HTTP') {
                // TODO: Make the timeout configurable
                const response = await fetch(data.url, {signal: AbortSignal.timeout(5000), method: data.method})
                this.logger.log(`${data.method} ${data.url} - ${response.status}`)
            }
        }
    }
}
