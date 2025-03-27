import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .alterTable('usr')
        .dropColumn('email')
        .dropColumn('first_name')
        .dropColumn('last_name')
        .dropColumn('password')
        .addColumn('sub', 'text', (cb) => cb.notNull().unique())
        .execute();

    await db.schema
        .createIndex('sub_index')
        .on('usr')
        .column('sub')
        .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .alterTable('usr')
        .addColumn('email', 'text', (cb) => cb.notNull().unique())
        .addColumn('first_name', 'text', (cb) => cb.notNull())
        .addColumn('last_name', 'text', (cb) => cb.notNull())
        .addColumn('password', 'text', (cb) => cb.notNull())
        .dropColumn('sub')
        .execute();

    await db.schema
        .dropIndex('sub_index')
        .execute()
}
