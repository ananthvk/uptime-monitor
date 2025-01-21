import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    await db.schema.alterTable('heartbeat').addColumn('error_reason', 'text').execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .alterTable('heartbeat')
        .dropColumn('error_reason')
        .execute()
}
