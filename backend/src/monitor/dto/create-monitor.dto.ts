import { IsEnum, IsNotEmpty, IsPort, IsString, IsUrl } from "class-validator";

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

    @IsUrl()
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
    method: 'GET'| 'HEAD'| 'OPTIONS'| 'TRACE'| 'PUT'| 'DELETE'| 'POST'| 'PATCH'| 'CONNECT'
}