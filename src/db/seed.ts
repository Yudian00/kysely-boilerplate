import bcrypt from "bcrypt";
import {v4} from "uuid";
import {db} from "./database";
import logger from "../helper/logger";

async function main() {
    const saltRounds = 10;

    // encrypt password
    const pass = "secretpass"
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pass, salt);

    await db
        .insertInto("user")
        .values({
            id: v4(),
            username: "admin",
            email: "admin@gmail.com",
            name: "admin",
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .execute();
}

main().catch(error => {
    logger.error(error);
    process.exit(1) // Terminate the process with an error code
}).finally(() => {
    process.exit(0); // Terminate the process successfully
});
