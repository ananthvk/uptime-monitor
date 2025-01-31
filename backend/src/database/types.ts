import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

export interface Database {
    user: UserTable,
    monitor: MonitorTable,
    heartbeat: HeartbeatTable
}

export interface UserTable {
    id: Generated<number>
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    date_registered: ColumnType<Date, never, never>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UpdateUser = Updateable<UserTable>

export interface MonitorTable {
    id: Generated<number>,
    usr_id: number,
    name: string,
    date_created: ColumnType<Date, never, never>,
    type: 'HTTP' | 'TCP',
    url: string,
    port: string,
    method: 'GET' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'PUT' | 'DELETE' | 'POST' | 'PATCH' | 'CONNECT',
    time_interval: number,
    request_timeout: number, // How much time to wait before the request time outs
    number_of_retries: number, // How many times should a failing service be checked
    retry_interval: number // Time interval between retries
}

export type Monitor = Selectable<MonitorTable>
export type NewMonitor = Insertable<MonitorTable>
export type UpdateMonitor = Updateable<MonitorTable>

export interface HeartbeatTable {
    id: Generated<number>,
    date: Date,
    result: 'SUCCESS' | 'FAILURE',
    response_time: number,
    status_code: number | null,
    monitor_id: number,
    error_reason?: string
}

export type Heartbeat = Selectable<HeartbeatTable>
export type NewHeartbeat = Insertable<HeartbeatTable>
export type UpdateHeartbeat = Updateable<HeartbeatTable>

export type MonitorReduced = Pick<Monitor, 'id' | 'name' | 'url' | 'port' | 'type' | 'time_interval'>