import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('employee')
        .addColumn('id', 'char(36)', (col) => col.primaryKey())
        .addColumn('name', 'varchar(255)', (col) => col.notNull())
        .addColumn('department_name', 'varchar(255)', (col) => col.notNull())
        .addColumn('ktp_number', 'varchar(255)', (col) => col.notNull())
        .addColumn('kk_number', 'varchar(255)', (col) => col.notNull())
        .addColumn('address', 'varchar(255)', (col) => col.notNull())
        .addColumn('domicile', 'varchar(255)', (col) => col.notNull())
        .addColumn('tax_status', sql`ENUM('K1', 'K2', 'S0')`, (col) => col.notNull())
        .addColumn('phone', 'varchar(15)', (col) => col.notNull())
        .addColumn('email', 'varchar(255)', (col) => col.notNull())
        .addColumn('join_date', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
        .addColumn('emergency_number', 'varchar(15)', (col) => col.notNull())
        .addColumn('employee_status', sql`ENUM('TETAP', 'KONTRAK', 'MAGANG')`, (col) => col.notNull())
        .addColumn('gender', sql`ENUM('LAKI-LAKI', 'PEREMPUAN')`, (col) => col.notNull())
        .addColumn('leave_quota', 'smallint', (col) => col.notNull())
        .addColumn('payroll', 'bigint', (col) => col.notNull())


        .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('deleted_at', 'timestamp')
        .execute();

    await db.schema
        .createIndex('employee_ktp_idx')
        .on('employee')
        .column('ktp_number')
        .execute();


}

export async function down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable('employee').execute();
}
