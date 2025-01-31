import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await db.schema.alterTable('monitor')
        .addColumn('request_timeout', 'integer', (cb) => cb.defaultTo(15))
        .addColumn('number_of_retries', 'integer', (cb) => cb.defaultTo(3))
        .addColumn('retry_interval', 'integer', (cb) => cb.defaultTo(60))
        .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .alterTable('monitor')
        .dropColumn('request_timeout')
        .dropColumn('number_of_retries')
        .dropColumn('retry_interval')
        .execute()
}
