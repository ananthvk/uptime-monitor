export type StatusDetailed = { date: Date, response_time: number, result: 'SUCCESS' | 'FAILURE', error_reason?: string }
export type Status = "SUCCESS" | "FAILURE" | "UNKNOWN"
export type Monitor = { id: string, name: string, url: string, port: string, type: string, method: string, time_interval: number }
export type MonitorReduced = Pick<Monitor, 'id' | 'name' | 'url' | 'port' | 'type' | 'time_interval'>

export const additionalRefectDelay = 1000
export const methods = ['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE', 'POST', 'PATCH', 'CONNECT'] as const
export const numberOfDataPointsInStatusBar = 30
export const numberOfDataPointsInGraph = 20