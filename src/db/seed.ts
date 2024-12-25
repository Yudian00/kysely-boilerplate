import bcrypt from 'bcrypt';
import { v4 } from "uuid";
import { db } from "./database";

async function main() {
    const saltRounds = 10;

    // encrypt password
    const pass = "superadmin123"
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pass, salt);

    await db
        .insertInto('user')
        .values({
            id: v4(),
            username: 'superadmin',
            email: 'superadmin@gmail.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .execute();
}

main().catch(error => {
    console.error(error)
    process.exit(1) // Terminate the process with an error code
});
