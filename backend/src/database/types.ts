import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

export interface Database {
    user: UserTable,
    monitor: MonitorTable
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
    user_id: number,
    name: string,
    date_created: ColumnType<Date, never, never>,
    type: 'HTTP' | 'TCP',
    url: string,
    port: string,
    method: 'GET' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'PUT' | 'DELETE' | 'POST' | 'PATCH' | 'CONNECT'
}

export type Monitor = Selectable<MonitorTable>
export type NewMonitor = Insertable<MonitorTable>
export type UpdateMonitor = Updateable<MonitorTable>