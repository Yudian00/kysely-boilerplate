import dotenv from 'dotenv';
import { CamelCasePlugin, Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { Employee, User } from './db';

dotenv.config()

export interface Database {
    employee: Employee;
    user: User;
}

const dialect = new MysqlDialect({
    pool: createPool({
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '3306'),
    })
})

export const db = new Kysely<Database>({
    dialect,
    log: ['query', 'error'],
    plugins: [
        new CamelCasePlugin()
    ],
})


