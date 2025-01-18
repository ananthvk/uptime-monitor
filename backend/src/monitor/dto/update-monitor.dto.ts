import { CreateMonitorDto } from "./create-monitor.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMonitorDto extends PartialType(CreateMonitorDto) { }