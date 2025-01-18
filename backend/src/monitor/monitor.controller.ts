import { Controller, Get } from '@nestjs/common';

@Controller('monitor')
export class MonitorController {
    @Get()
    findAll(): string {
        return 'All monitors'
    }
}
