import {Kysely, sql} from "kysely";

const TABLE_NAME = "audit_error";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable(TABLE_NAME)
        .addColumn("id", "char(36)", (col) => col.primaryKey())
        .addColumn("endpoint", "varchar(255)", (col) => col.notNull())
        .addColumn("error_trace", "text")

        .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn("deleted_at", "timestamp")

        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable(TABLE_NAME).execute();
}