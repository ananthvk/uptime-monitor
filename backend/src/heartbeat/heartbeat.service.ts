import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Monitor } from 'src/database/types';

@Injectable()
export class HeartbeatService {
    private readonly logger = new Logger(HeartbeatService.name)

    constructor(@InjectQueue('heartbeat') private heartbeatQueue: Queue) {
    }

    // Returns the repeatable job key
    async addHeartbeatTask(monitor: Monitor): Promise<string> {
        // Add this monitor to the heartbeat queue
        const job = await this.heartbeatQueue.add('check_heartbeat',
            monitor, {
            repeat: {
                every: monitor.time_interval * 1000
            }
        })
        this.logger.log(`Added ${monitor.id} to job queue with id ${job.repeatJobKey}`)
        return job.repeatJobKey!
    }

    async removeHeartbeatTask(jobKey: string): Promise<void> {
        await this.heartbeatQueue.removeJobScheduler(jobKey)
        this.logger.log(`Removed ${jobKey} from job queue`)
    }
}
