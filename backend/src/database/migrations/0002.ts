import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .createTable('monitor')
        .addColumn('id', 'serial', (cb) => cb.primaryKey())
        .addColumn('name', 'text', (cb) => cb.notNull())
        .addColumn('date_created', 'timestamptz', (cb) => cb.notNull().defaultTo(sql`now()`))
        .addColumn('type', 'text', (cb) => cb.notNull())
        .addColumn('url', 'text', (cb) => cb.notNull())
        .addColumn('port', 'integer', (cb) => cb.notNull().defaultTo(80))
        .addColumn('method', 'text')
        .addColumn('usr_id', 'integer')
        .addForeignKeyConstraint(
            'usr_id_monitor_fkey',
            ['usr_id'],
            'usr',
            ['id'],
            (cb) => cb.onDelete('cascade')
        )
        .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema.dropTable('monitor').execute();
}
