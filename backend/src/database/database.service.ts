import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './types';


@Global()
@Injectable()
export class DatabaseService {
    private db: Kysely<Database>;
    constructor(private configService: ConfigService) {
        const dialect = new PostgresDialect({
            pool: new Pool({
                database: configService.get('DB_NAME'),
                host: configService.get('DB_HOST'),
                user: configService.get('DB_USER'),
                port: configService.get('DB_PORT'),
                password: configService.get('DB_PASSWORD'),
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
