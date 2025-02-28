import {DB} from "../../../db/db";
import {Kysely} from "kysely";
import {IUser, IUserCreate, IUserFilter, IUserUpdate} from "./user.dto";
import {HttpRequestError} from "../../../helper/error";
import {applyPagination} from "../../../helper/pagination";

export class UserRepository {
    private readonly db: Kysely<DB>

    constructor(db: Kysely<DB>) {
        this.db = db;
    }

    async findAll(filters: IUserFilter) {
        let query = this.db
            .selectFrom("user")
            .select([
                "user.id",
                "user.username",
                "user.name",
                "user.email",
            ])
            .where("user.deletedAt", "is", null)
            .orderBy("user.createdAt", "desc")

        if (filters.name) {
            query = query.where("user.name", "like", `%${filters.name}%`)
        }

        const {result, meta} = await applyPagination<IUser>(query, filters);
        return {result, meta};
    }

    async findById(id: string) {
        const result = await this.db
            .selectFrom("user")
            .select([
                "user.id",
                "user.username",
                "user.name",
                "user.email",
                "user.createdAt",
                "user.updatedAt",
            ])
            .where("user.id", "=", id)
            .where("user.deletedAt", "is", null)
            .executeTakeFirst();

        if (!result) {
            throw new HttpRequestError(404, "Data User tidak ditemukan", "Not Found");
        }

        return result
    }

    async create(data: IUserCreate) {
        return await this.db.transaction().execute(async (trx) => {
            await trx.insertInto("user")
                .values(data)
                .executeTakeFirstOrThrow();
        });

    }

    async update(id: string, data: IUserUpdate) {
        return await this.db.transaction().execute(async (trx) => {
            await trx.updateTable("user")
                .set(data)
                .where("id", "=", id)
                .executeTakeFirstOrThrow();
        })
    }

    async delete(id: string, deletedBy: string) {
        return await this.db.transaction().execute(async (trx) => {
            await trx.updateTable("user")
                .set({
                    deletedAt: new Date(),
                    deletedBy: deletedBy,
                })
                .where("id", "=", id)
                .executeTakeFirstOrThrow();
        });
    }
}