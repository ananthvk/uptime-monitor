import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Heartbeat } from 'src/database/types';
type Status = Heartbeat['result']
type StatusDetailed = Pick<Heartbeat, 'date' | 'response_time' | 'result' | 'error_reason'>
type StatusDateTimeBin = '10 min' | '1 hour' | '1 day' | '1 week' | '1 month'

@Injectable()
export class StatusService {
    constructor(private readonly databaseService: DatabaseService) {
    }
    async getLatestNStatuses(usr_id: number, monitor_id: number, n: number): Promise<Status[]> {
        return (await this.databaseService.getDb()
            .selectFrom('heartbeat')
            .innerJoin('monitor', 'heartbeat.monitor_id', 'monitor.id')
            .where('heartbeat.monitor_id', '=', monitor_id)
            .where('monitor.usr_id', '=', usr_id)
            .orderBy('heartbeat.date desc')
            .limit(n)
            .select(['heartbeat.result'])
            .execute()
        ).map(res => res.result)
    }
    async getLastNStatusesDetailed(usr_id: number, monitor_id: number, n: number): Promise<StatusDetailed[]> {
        return await this.databaseService.getDb()
            .selectFrom('heartbeat')
            .innerJoin('monitor', 'heartbeat.monitor_id', 'monitor.id')
            .where('heartbeat.monitor_id', '=', monitor_id)
            .where('monitor.usr_id', '=', usr_id)
            .orderBy('heartbeat.date desc')
            .limit(n)
            .select(['heartbeat.date', 'heartbeat.response_time', 'heartbeat.result', 'heartbeat.error_reason'])
            .execute()
    }
    async deleteStatus(usr_id: number, monitor_id: number) {
        // Check if the monitor actually belongs to the user
        const { id } = await this.databaseService.getDb()
            .selectFrom('monitor')
            .select('id')
            .where('usr_id', '=', usr_id)
            .where('id', '=', monitor_id)
            .executeTakeFirstOrThrow(() => new NotFoundException('Monitor with given id not found'))

        return await this.databaseService.getDb()
            .deleteFrom('heartbeat')
            .where('monitor_id', '=', id)
            .executeTakeFirstOrThrow(() => new NotFoundException('Monitor with given id not found'))
    }
    
    async getStatusAggregate(usr_id: number, monitor_id: number, status_bin: StatusDateTimeBin, limit: number) {
        const db = this.databaseService.getDb();
        return await db
                .selectFrom('heartbeat')
                .innerJoin('monitor', 'heartbeat.monitor_id', 'monitor.id')
                .where('heartbeat.monitor_id', '=', monitor_id)
                .where('monitor.usr_id', '=', usr_id)
                .orderBy('heartbeat.date desc')
                .limit(limit)
                .execute()
    }
}
