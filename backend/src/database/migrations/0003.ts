import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .alterTable('monitor')
        .addColumn('time_interval', 'integer', (cb) => cb.notNull().defaultTo(5))
        .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema.alterTable('monitor').dropColumn('time_interval').execute();
}
