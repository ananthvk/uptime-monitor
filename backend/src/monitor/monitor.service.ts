import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { DatabaseService } from 'src/database/database.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MonitorService {
    constructor(@InjectQueue('heartbeat') private heartbeatQueue: Queue, private readonly databaseService: DatabaseService) {
    }

    async findAll(user_id: number) {
        return await this.databaseService.getDb()
            .selectFrom('monitor')
            .where('usr_id', '=', user_id)
            .select(['monitor.id', 'monitor.usr_id', 'monitor.name', 'monitor.date_created', 'monitor.type', 'monitor.url', 'monitor.port', 'monitor.method'])
            .execute()
    }

    async findOne(user_id: number, monitor_id: number) {
        return await this.databaseService.getDb()
            .selectFrom('monitor')
            .where('usr_id', '=', user_id)
            .where('id', '=', monitor_id)
            .select(['id', 'usr_id', 'name', 'date_created', 'type', 'url', 'port', 'method', 'time_interval'])
            .executeTakeFirstOrThrow(() => new NotFoundException("Monitor with given id not found"))
    }

    async update(user_id: number, monitor_id: number, updateMonitorDto: UpdateMonitorDto) {
        await this.databaseService.getDb()
            .updateTable('monitor')
            .set(updateMonitorDto)
            .where('usr_id', '=', user_id)
            .where('id', '=', monitor_id)
            .executeTakeFirstOrThrow(() => new NotFoundException("Monitor with given id not found"))
        return this.findOne(user_id, monitor_id)
    }

    async delete(user_id: number, monitor_id: number) {
        const result = await this.databaseService.getDb()
            .deleteFrom('monitor')
            .where('usr_id', '=', user_id)
            .where('id', '=', monitor_id)
            .executeTakeFirstOrThrow(() => new NotFoundException("Monitor with given id not found"))
        return { "deleted": result.numDeletedRows.toString() }
    }

    async create(user_id: number, createMonitorDto: CreateMonitorDto) {
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

        // Add this monitor to the heartbeat queue
        // TODO: Add job id to db
        const job = await this.heartbeatQueue.add('check_heartbeat', {
            id: result.id,
            name: createMonitorDto.name,
            usr_id: user_id,
            method: createMonitorDto.method,
            port: createMonitorDto.port,
            type: createMonitorDto.type,
            url: createMonitorDto.url,
            time_interval: createMonitorDto.time_interval
        }, {
            repeat: {
                every: createMonitorDto.time_interval * 1000
            }
        })
        return { ...result, job_id: job.id }
    }
}

