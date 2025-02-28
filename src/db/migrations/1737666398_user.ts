import {Kysely, sql} from "kysely";

const TABLE_NAME = "user";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable(TABLE_NAME)
        .addColumn("id", "char(36)", (col) => col.primaryKey())
        .addColumn("username", "varchar(255)", (col) => col.unique().notNull())
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("password", "varchar(255)", (col) => col.notNull())
        .addColumn("email", "varchar(255)", (col) => col.notNull())

        .addColumn("created_by", "char(36)", (col) => col.references("user.id").onDelete("cascade"))
        .addColumn("updated_by", "char(36)", (col) => col.references("user.id").onDelete("cascade"))
        .addColumn("deleted_by", "char(36)", (col) => col.references("user.id").onDelete("cascade"))
        .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn("deleted_at", "timestamp")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable(TABLE_NAME).execute();
}
