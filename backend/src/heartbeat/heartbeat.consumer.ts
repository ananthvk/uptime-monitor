import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Job, Queue } from 'bullmq';
import { DatabaseService } from 'src/database/database.service';
import { Monitor } from 'src/database/types';

@Injectable()
@Processor({ name: 'heartbeat' })
export class HeartbeatConsumer extends WorkerHost {
    private readonly logger = new Logger(HeartbeatConsumer.name)
    constructor(@InjectQueue('heartbeat') private readonly queue: Queue, private readonly databaseService: DatabaseService) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        const data: Monitor = job.data
        let response
        if (data.type === 'HTTP') {
            // TODO: Make the timeout configurable
            try {
                response = await axios({
                    headers: {
                        'User-Agent': 'uptime-monitor: Uptime monitoring service'
                    },
                    method: data.method,
                    url: data.url,
                    timeout: 5 * 1000
                })
                await this.databaseService.getDb()
                    .insertInto('heartbeat')
                    .values({
                        date: new Date(),
                        monitor_id: data.id,
                        response_time: 0,
                        status_code: response.status,
                        result: 'SUCCESS'
                    }).execute()
                this.logger.log(`${data.method} ${data.url} - ${response.status}`)

            } catch (e: any) {
                await this.databaseService.getDb()
                    .insertInto('heartbeat')
                    .values({
                        date: new Date(),
                        monitor_id: data.id,
                        response_time: 0,
                        status_code: response?.status,
                        result: 'FAILURE',
                        error_reason: e.message
                    }).execute()
                this.logger.log(`${data.method} ${data.url} - ${e.message}`)
            }
        }
    }
}
