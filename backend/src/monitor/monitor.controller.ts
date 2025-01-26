import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { usr_id as currentUserId } from 'src/constants'

@Controller('monitor')
export class MonitorController {
    constructor(private readonly monitorService: MonitorService) {
    }

    // GET /monitors, return all monitors created by the current user
    @Get()
    async findAll() {
        // Simulate waiting time
        // await new Promise(resolve => setTimeout(resolve, 5000))
        return await this.monitorService.findAll(currentUserId)
    }

    // GET /monitor/:id, return details of a single monitor
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.monitorService.findOne(currentUserId, id)
    }

    // POST /monitor, create a new monitor
    @Post()
    async create(@Body(ValidationPipe) createMonitorDto: CreateMonitorDto) {
        return await this.monitorService.create(currentUserId, createMonitorDto)
    }

    // PATCH /monitor/:id, update a monitor
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateMonitorDto: UpdateMonitorDto) {
        return await this.monitorService.update(currentUserId, id, updateMonitorDto)
    }

    // DELETE /monitor/:id, delete a monitor
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.monitorService.delete(currentUserId, id)
    }
}
