import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .createTable('usr')
        .addColumn('id', 'serial', (cb) => cb.primaryKey())
        .addColumn('email', 'text', (cb) => cb.notNull().unique())
        .addColumn('first_name', 'text', (cb) => cb.notNull())
        .addColumn('last_name', 'text', (cb) => cb.notNull())
        .addColumn('password', 'text', (cb) => cb.notNull())
        .addColumn('date_registered', 'timestamptz', (cb) => cb.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema.dropTable('usr').execute();
}
