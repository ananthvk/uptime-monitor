import { IsEnum, IsNotEmpty, IsNumber, IsPort, IsString, IsUrl, Max, Min } from "class-validator";
import { maxNumberOfRetriesFailedMonitor } from "src/constants";

export class CreateMonitorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['HTTP', 'TCP'], {
        message: 'Valid type required'
    })
    type: 'HTTP' | 'TCP';

    // TODO: Also support ip address
    @IsUrl({}, { message: 'Must be a valid URL' })
    @IsNotEmpty()
    url: string;

    @IsPort()
    @IsString()
    @IsNotEmpty()
    port: string

    @IsString()
    @IsEnum(['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE', 'POST', 'PATCH', 'CONNECT'], {
        message: 'Invalid HTTP method'
    })
    method: 'GET' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'PUT' | 'DELETE' | 'POST' | 'PATCH' | 'CONNECT'
    
    @IsNumber()
    @IsNotEmpty()
    @Min(5)
    time_interval: number

    @IsNumber()
    @IsNotEmpty()
    request_timeout: number
    
    @IsNumber()
    @IsNotEmpty()
    @Max(maxNumberOfRetriesFailedMonitor)
    number_of_retries: number
    
    @IsNumber()
    @IsNotEmpty()
    @Min(5)
    retry_interval: number
}