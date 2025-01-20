import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .createTable('hearbeat')
        .addColumn('id', 'serial', (cb) => cb.primaryKey())
        .addColumn('date', 'timestamptz', (cb) => cb.notNull().defaultTo(sql`now()`))
        .addColumn('result', 'text', (cb) => cb.notNull())
        .addColumn('response_time', 'integer')
        .addColumn('status_code', 'integer')
        .addColumn('monitor_id', 'integer', (cb) => cb.notNull())
        .addForeignKeyConstraint(
            'monitor_id_heartbeat_fkey',
            ['monitor_id'],
            'monitor',
            ['id'],
            (cb) => cb.onDelete('cascade')
        )
        .execute()

    await db.schema
        .alterTable('monitor')
        .addColumn('job_id', 'text')
        .execute()

}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema.dropTable('heartbeat').execute();
    await db.schema.alterTable('monitor').dropColumn('job_id').execute()
}
