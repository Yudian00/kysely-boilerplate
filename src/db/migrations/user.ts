import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('user')
        .addColumn('id', 'char(36)', (col) => col.primaryKey())
        .addColumn('username', 'varchar(255)', (col) => col.notNull())
        .addColumn('password', 'varchar(255)', (col) => col.notNull())
        .addColumn('email', 'varchar(255)', (col) => col.notNull())

        .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('deleted_at', 'timestamp')
        .execute();

    await db.schema
        .createIndex('user_username_idx')
        .on('user')
        .column('username')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable('user').execute();
}
