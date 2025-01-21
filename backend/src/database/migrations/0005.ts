import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
    // Remove column job_id
    await db.schema.alterTable('monitor').dropColumn('job_id').execute()

}

export async function down(db: Kysely<unknown>): Promise<void> {
    await db.schema
        .alterTable('monitor')
        .addColumn('job_id', 'text')
        .execute()
}
