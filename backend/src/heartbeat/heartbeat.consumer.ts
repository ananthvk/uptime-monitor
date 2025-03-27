import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { Job, Queue } from 'bullmq';
import { DatabaseService } from 'src/database/database.service';
import { Monitor } from 'src/database/types';

type InternalAxiosRequestConfigWithMetadata = InternalAxiosRequestConfig & { metadata: any }

// https://stackoverflow.com/questions/49874594/how-to-get-response-times-from-axios
axios.interceptors.request.use(function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfigWithMetadata {
    return { ...config, metadata: { startTime: new Date() } }
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response: any) {
    response.config.metadata.endTime = new Date()
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime
    return response;
}, function (error) {
    error.config.metadata.endTime = new Date();
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
});


@Injectable()
@Processor({ name: 'heartbeat' })
export class HeartbeatConsumer extends WorkerHost {
    private readonly logger = new Logger(HeartbeatConsumer.name)
    constructor(@InjectQueue('heartbeat') private readonly queue: Queue, private readonly databaseService: DatabaseService) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        const monitor: Monitor & { failureCount: number } = job.data
        let response
        if (monitor.type === 'HTTP') {
            // TODO: Make the timeout configurable
            try {
                response = await axios({
                    headers: {
                        'User-Agent': 'uptime-monitor: Uptime monitoring service'
                    },
                    method: monitor.method,
                    url: monitor.url,
                    timeout: monitor.request_timeout * 1000
                })
                await this.databaseService.getDb()
                    .insertInto('heartbeat')
                    .values({
                        date: new Date(),
                        monitor_id: monitor.id,
                        response_time: (response as any).duration,
                        status_code: response.status,
                        result: 'SUCCESS'
                    }).execute()
                // this.logger.log(`${data.method} ${data.url} - ${response.status} ${(response as any).duration}`)

            } catch (e: any) {
                await this.databaseService.getDb()
                    .insertInto('heartbeat')
                    .values({
                        date: new Date(),
                        monitor_id: monitor.id,
                        response_time: 0,
                        status_code: response?.status,
                        result: 'FAILURE',
                        error_reason: e.message
                    }).execute()
                this.logger.log(`${monitor.method} ${monitor.url} - ${e.message}`)
                // The job has failed, increase the job's failure count by one
                // await job.updateData({
                //    ...monitor, failureCount: monitor.failureCount + 1
                //})
                throw e
            }
        }
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job) {
        this.logger.log(`${job.id} [${job.name}] failed, ${job.attemptsMade} ${job.data.failureCount}`)
    }
}
