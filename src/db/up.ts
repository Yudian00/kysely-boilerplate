import {promises as fs} from "fs"
import {FileMigrationProvider, Migrator} from "kysely"
import * as path from "path"
import {db} from "./database"
import logger from "../helper/logger";

async function migrateToLatest() {
    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, "./migrations"),
        }),
    })

    const {error, results} = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === "Success") {
            logger.info(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === "Error") {
            logger.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        logger.error("failed to migrate", error)
        process.exit(1)
    }

    await db.destroy()
}

migrateToLatest().then(() => logger.info("migrate done")).catch(logger.error)