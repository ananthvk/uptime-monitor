import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { DatabaseService } from 'src/database/database.service';
import { HeartbeatService } from 'src/heartbeat/heartbeat.service';
import { Monitor } from 'src/database/types';

@Injectable()
export class MonitorService {
    constructor(private readonly heartbeatService: HeartbeatService, private readonly databaseService: DatabaseService) {
    }

    async findAll(user_id: number) {
        return await this.databaseService.getDb()
            .selectFrom('monitor')
            .where('usr_id', '=', user_id)
            .select(['monitor.id', 'monitor.usr_id', 'monitor.name', 'monitor.date_created', 'monitor.type', 'monitor.url', 'monitor.port', 'monitor.method'])
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

        // Remove any existing job
        if (monitor.job_id) {
            await this.heartbeatService.removeHeartbeatTask(monitor.job_id)
        }

        const job_id = await this.heartbeatService.addHeartbeatTask(monitor!)
        // Add the job id to the DB
        await this.databaseService.getDb()
            .updateTable('monitor')
            .set({
                job_id: job_id
            })
            .where('id', '=', monitor_id)
            .executeTakeFirstOrThrow()

        return { ...monitor, job_id: job_id }
    }

    async delete(user_id: number, monitor_id: number) {
        // Remove any associated tasks
        const res = await this.databaseService.getDb()
            .selectFrom('monitor')
            .select('job_id')
            .where('monitor.id', '=', monitor_id)
            .executeTakeFirst()
        if (res && res.job_id) {
            await this.heartbeatService.removeHeartbeatTask(res.job_id)
        }

        const result = await this.databaseService.getDb()
            .deleteFrom('monitor')
            .where('usr_id', '=', user_id)
            .where('id', '=', monitor_id)
            .executeTakeFirstOrThrow(() => new NotFoundException("Monitor with given id not found"))
        return { "deleted": result.numDeletedRows.toString() }
    }

    async create(user_id: number, createMonitorDto: CreateMonitorDto) {
        // TODO: Wrap this in a transaction
        const result = await this.databaseService.getDb().insertInto('monitor').values({
            name: createMonitorDto.name,
            usr_id: user_id,
            method: createMonitorDto.method,
            port: createMonitorDto.port,
            type: createMonitorDto.type,
            url: createMonitorDto.url,
            time_interval: createMonitorDto.time_interval
        })
            .returning(['id', 'name', 'usr_id', 'method', 'port', 'type', 'url'])
            .executeTakeFirstOrThrow()

        const monitor = await this.databaseService.getDb()
            .selectFrom('monitor')
            .where('id', '=', result.id)
            .selectAll()
            .executeTakeFirst()
        const job_id = await this.heartbeatService.addHeartbeatTask(monitor!)
        // Add the job id to the DB
        await this.databaseService.getDb()
            .updateTable('monitor')
            .set({
                job_id: job_id
            })
            .where('id', '=', result.id)
            .executeTakeFirstOrThrow()

        return result
    }
}

