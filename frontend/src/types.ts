export type StatusDetailed = { date: Date, response_time: number, result: 'SUCCESS' | 'FAILURE', error_reason?: string }
export type Status = "SUCCESS" | "FAILURE" | "UNKNOWN"
export type Monitor = {
    id: string
    name: string
    url: string
    port: string
    type: string
    method: string
    time_interval: number
    request_timeout: number
    number_of_retries: number
    retry_interval: number
}
export type MonitorReduced = Pick<Monitor, 'id' | 'name' | 'url' | 'port' | 'type' | 'time_interval'>