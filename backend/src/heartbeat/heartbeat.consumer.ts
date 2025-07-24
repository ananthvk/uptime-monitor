import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { Job, Queue } from 'bullmq';
import { DatabaseService } from 'src/database/database.service';
import { Monitor } from 'src/database/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


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
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache, @InjectQueue('heartbeat') private readonly queue: Queue, private readonly databaseService: DatabaseService) {
        super();
    }
    async process(job: Job<any, any, string>): Promise<any> {
        const monitor: Monitor & { failureCount: number } = job.data

        let response
        if (monitor.type === 'HTTP') {
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
                // Reset failure counter on successful request
                const failureKey = `fail-${monitor.id}`;
                await this.cacheManager.del(failureKey);

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
                throw e
            }
        }
    }
    private async alert(monitor: Monitor, monitorId: string, failureCount: number) {
        this.logger.warn(`ALERT: Monitor ${monitorId} has failed ${failureCount} times consecutively!`)
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job) {
        const monitor: Monitor = job.data;
        const failureKey = `fail-${monitor.id}`;

        try {
            // TODO: Not atomic, make it atomic by using INCR with redis client
            const currentFailures = await this.cacheManager.get<number>(failureKey) || 0;
            const newFailureCount = currentFailures + 1;

            await this.cacheManager.set(failureKey, newFailureCount, monitor.retry_interval * 1000);

            this.logger.log(`${job.id} [${job.name}] failed, attempt ${job.attemptsMade}, failure count: ${newFailureCount}`)

            if (newFailureCount >= (job.data as Monitor).number_of_retries) {
                await this.alert(monitor, monitor.id.toString(), newFailureCount);
                // await this.cacheManager.del(failureKey);
            }
        } catch (error) {
            this.logger.error(`Error handling failure tracking for monitor ${monitor.id}:`, error);
        }
    }
}
