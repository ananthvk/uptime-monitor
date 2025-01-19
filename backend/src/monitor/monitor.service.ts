import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MonitorService {
    constructor(private readonly databaseService: DatabaseService) {
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
            .select(['id', 'usr_id', 'name', 'date_created', 'type', 'url', 'port', 'method'])
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
        return await this.databaseService.getDb().insertInto('monitor').values({
            name: createMonitorDto.name,
            usr_id: user_id,
            method: createMonitorDto.method,
            port: createMonitorDto.port,
            type: createMonitorDto.type,
            url: createMonitorDto.url
        })
            .returning(['id', 'name', 'usr_id', 'method', 'port', 'type', 'url'])
            .executeTakeFirstOrThrow()
    }
}

