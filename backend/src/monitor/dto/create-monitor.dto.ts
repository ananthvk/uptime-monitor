import { IsEnum, IsNotEmpty, IsNumber, IsPort, IsString, IsUrl, Min } from "class-validator";

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
}