import { BadRequestException, Controller, Delete, Get, Param, ParseIntPipe, Query, Request, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { maxNumberOfStatus } from 'src/constants';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('status')
@UseGuards(JwtAuthGuard)
export class StatusController {
    constructor(private readonly statusService: StatusService) {
    }

    @Get(':id/latest')
    async getLatestNStatuses(@Request() req: Request, @Param('id', ParseIntPipe) monitor_id: number, @Query('n', ParseIntPipe) n: number) {
        if (n <= 0 || n > maxNumberOfStatus)
            throw new BadRequestException('Invalid value of n passed')
        const currentUserId = (req as any).user.user_id
        return this.statusService.getLatestNStatuses(currentUserId, monitor_id, n)
    }

    @Get(':id/latest/detailed')
    async getLatestNStatusesDetailed(@Param('id', ParseIntPipe) monitor_id: number, @Query('n', ParseIntPipe) n: number, @Request() req: Request) {
        if (n <= 0 || n > maxNumberOfStatus)
            throw new BadRequestException('Invalid value of n passed')
        const currentUserId = (req as any).user.user_id
        return this.statusService.getLastNStatusesDetailed(currentUserId, monitor_id, n)
    }

    @Delete(':monitor_id')
    async deleteStatus(@Param('monitor_id', ParseIntPipe) monitor_id: number, @Request() req: Request) {
        const currentUserId = (req as any).user.user_id
        this.statusService.deleteStatus(currentUserId, monitor_id)
    }
}
