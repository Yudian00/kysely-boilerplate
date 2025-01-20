import { Kysely } from "kysely";
import { Database } from "../../../db/database";

export class UserRepository {
    private readonly db: Kysely<Database>
    constructor(db: Kysely<Database>) {
        this.db = db;
    }

    async findById(id: string) {
        const result = await this.db
            .selectFrom('user')
            .selectAll()
            .where('user.id', 'is', id)
            .where('user.deletedAt', 'is', null)
            .executeTakeFirstOrThrow();

        return result;
    }
}