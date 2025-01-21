import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Monitor } from 'src/database/types';

@Injectable()
export class HeartbeatService {
    private readonly logger = new Logger(HeartbeatService.name)

    constructor(@InjectQueue('heartbeat') private heartbeatQueue: Queue) {
    }

    // Add or update a heartbeat task
    async upsertHeartbeatTask(monitor: Monitor, schedulerId: string): Promise<void> {
        await this.heartbeatQueue.upsertJobScheduler(schedulerId, {
            every: monitor.time_interval * 1000
        }, {
            data: monitor,
            opts: {
                removeOnComplete: true
            }
        })
        this.logger.log(`Upserted "${monitor.name}" [${monitor.id}] to job queue with jobId=${schedulerId}`)
    }

    async removeHeartbeatTask(jobId: string): Promise<void> {
        await this.heartbeatQueue.removeJobScheduler(jobId)
        this.logger.log(`Removed ${jobId} from the job queue`)
    }
}
