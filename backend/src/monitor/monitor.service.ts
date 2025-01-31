import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { DatabaseService } from 'src/database/database.service';
import { HeartbeatService } from 'src/heartbeat/heartbeat.service';
import { Monitor, MonitorReduced } from 'src/database/types';

@Injectable()
export class MonitorService {
    constructor(private readonly heartbeatService: HeartbeatService, private readonly databaseService: DatabaseService) {
    }

    async findAll(user_id: number): Promise<MonitorReduced[]> {
        return await this.databaseService.getDb()
            .selectFrom('monitor')
            .where('usr_id', '=', user_id)
            .select(['id', 'name', 'type', 'url', 'port', 'method', 'time_interval'])
            .execute()
    }

    async findOne(user_id: number, monitor_id: number): Promise<Monitor> {
        return await this.databaseService.getDb()
            .selectFrom('monitor')
            .where('usr_id', '=', user_id)
            .where('id', '=', monitor_id)
            .selectAll()
            .executeTakeFirstOrThrow(() => new NotFoundException("Monitor with given id not found"))
    }

    async update(user_id: number, monitor_id: number, updateMonitorDto: UpdateMonitorDto): Promise<Monitor> {
        const monitor: Monitor = await this.databaseService.getDb()
            .updateTable('monitor')
            .set(updateMonitorDto)
            .where('usr_id', '=', user_id)
            .where('id', '=', monitor_id)
            .returningAll()
            .executeTakeFirstOrThrow(() => new NotFoundException("Monitor with given id not found"))

        await this.heartbeatService.upsertHeartbeatTask(monitor, `monitor-${monitor!.id}`)
        return { ...monitor }
    }

    async delete(user_id: number, monitor_id: number) {
        const result = await this.databaseService.getDb()
            .deleteFrom('monitor')
            .where('usr_id', '=', user_id)
            .where('id', '=', monitor_id)
            .executeTakeFirstOrThrow(() => new NotFoundException("Monitor with given id not found"))
        await this.heartbeatService.removeHeartbeatTask(`monitor-${monitor_id}`)
        return { "deleted": result.numDeletedRows.toString() }
    }

    async create(user_id: number, createMonitorDto: CreateMonitorDto): Promise<Monitor> {
        // TODO: Wrap this in a transaction
        const result = await this.databaseService.getDb().insertInto('monitor').values({ ...createMonitorDto, usr_id: user_id })
            .returning(['id'])
            .executeTakeFirstOrThrow()

        const monitor: Monitor = await this.databaseService.getDb()
            .selectFrom('monitor')
            .where('id', '=', result.id)
            .selectAll()
            .executeTakeFirstOrThrow()

        await this.heartbeatService.upsertHeartbeatTask(monitor, `monitor-${monitor!.id}`)
        return monitor
    }
}

