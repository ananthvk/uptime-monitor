import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
    Kysely,
    Migrator,
    PostgresDialect,
    FileMigrationProvider,
} from 'kysely'
import { Database } from './types'
import { config } from 'dotenv'
import { ConfigService } from '@nestjs/config'

config()
const configService = new ConfigService();

async function migrateToLatest() {
    const db = new Kysely<Database>({
        dialect: new PostgresDialect({
            pool: new Pool({
                database: configService.get('DB_NAME'),
                host: configService.get('DB_HOST'),
                user: configService.get('DB_USER'),
                port: configService.get('DB_PORT'),
                password: configService.get('DB_PASSWORD'),
            }),
        }),
    })

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, 'migrations'),
        }),
    })

    const { error, results } = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}

migrateToLatest()

