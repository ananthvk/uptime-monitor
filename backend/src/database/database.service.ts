import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './types';

@Injectable()
export class DatabaseService {
    private db: Kysely<Database>;
    constructor(private configService: ConfigService) {
        const dialect = new PostgresDialect({
            pool: new Pool({
                database: configService.getOrThrow('DB_NAME'),
                host: configService.getOrThrow('DB_HOST'),
                user: configService.getOrThrow('DB_USER'),
                port: configService.getOrThrow('DB_PORT'),
                password: configService.getOrThrow('DB_PASSWORD'),
                ssl: configService.get('DB_SSL') || false
            })
        })

        this.db = new Kysely<Database>({
            dialect,
        })

    }

    getDb() {
        return this.db
    }
}
