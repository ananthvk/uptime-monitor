import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

const currentUserId = 101

@Controller('monitor')
export class MonitorController {
    constructor(private readonly monitorService: MonitorService) {
    }

    // GET /monitors, return all monitors created by the current user
    @Get()
    findAll(){
        return this.monitorService.findAll(currentUserId)
    }

    // GET /monitor/:id, return details of a single monitor
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.monitorService.findOne(id)
    }

    // POST /monitor, create a new monitor
    @Post()
    create(@Body(ValidationPipe) createMonitorDto: CreateMonitorDto) {
        return this.monitorService.create(currentUserId, createMonitorDto)
    }

    // PATCH /monitor/:id, update a monitor
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateMonitorDto: UpdateMonitorDto) {
        return this.monitorService.update(id, updateMonitorDto)
    }

    // DELETE /monitor/:id, delete a monitor
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.monitorService.delete(id)
    }
}
