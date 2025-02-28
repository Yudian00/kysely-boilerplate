import dotenv from "dotenv";
import {CamelCasePlugin, Kysely, MysqlDialect} from "kysely";
import {createPool} from "mysql2";
import {DB} from "./db";

dotenv.config()

const dialect = new MysqlDialect({
    pool: createPool({
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "3306"),
    })
})

export const db = new Kysely<DB>({
    dialect,
    log: ["query", "error"],
    plugins: [
        new CamelCasePlugin()
    ],
})

