import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { StatusService } from './status.service';
const usr_id = 101;
const maxNumberOfStatus = 50

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
}
