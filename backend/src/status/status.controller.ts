import { BadRequestException, Controller, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { StatusService } from './status.service';
import { maxNumberOfStatus, usr_id } from 'src/constants';

@Controller('status')
export class StatusController {
    constructor(private readonly statusService: StatusService) {
    }
    @Get(':id/latest')
    async getLatestNStatuses(@Param('id', ParseIntPipe) monitor_id: number, @Query('n', ParseIntPipe) n: number) {
        if (n <= 0 || n > maxNumberOfStatus)
            throw new BadRequestException('Invalid value of n passed')
        return this.statusService.getLatestNStatuses(usr_id, monitor_id, n)
    }

    @Get(':id/latest/detailed')
    async getLatestNStatusesDetailed(@Param('id', ParseIntPipe) monitor_id: number, @Query('n', ParseIntPipe) n: number) {
        if (n <= 0 || n > maxNumberOfStatus)
            throw new BadRequestException('Invalid value of n passed')
        return this.statusService.getLastNStatusesDetailed(usr_id, monitor_id, n)
    }

    @Delete(':monitor_id')
    async deleteStatus(@Param('monitor_id', ParseIntPipe) monitor_id: number) {
        this.statusService.deleteStatus(usr_id, monitor_id)
    }
}
