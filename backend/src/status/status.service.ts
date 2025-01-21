import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Heartbeat } from 'src/database/types';
type Status = Heartbeat['result']
const max_n = 30

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
}
