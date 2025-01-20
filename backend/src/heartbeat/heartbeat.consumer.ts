import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Job, Queue } from 'bullmq';
import { Monitor } from 'src/database/types';

@Injectable()
@Processor('heartbeat')
export class HeartbeatConsumer extends WorkerHost {
    private readonly logger = new Logger(HeartbeatConsumer.name)
    constructor(@InjectQueue('heartbeat') private readonly queue: Queue) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        if (job.name === 'check_heartbeat') {
            const data: Monitor  = job.data
            if (data.type === 'HTTP') {
                // TODO: Make the timeout configurable
                try {
                    const response = await axios({
                        method: data.method,
                        url: data.url,
                        timeout: 5 * 1000
                    })
                    this.logger.log(`${data.method} ${data.url} - ${response.status}`)
                } catch (e: any) {
                    this.logger.log(`${data.method} ${data.url} - ${e.message}`)
                }
            }
        }
    }
}
