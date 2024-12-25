import { Kysely } from "kysely";
import { v4 } from "uuid";
import { Database } from "../../../db/database";
import { IAuthLogin } from "./auth.dto";
import { IUserCreate, IUserUpdate } from "./auth.interface";
import { HttpRequestError } from "../../../helper/error";
import { StatusCodes } from "http-status-codes";

export class AuthRepository {
    private readonly db: Kysely<Database>
    constructor(db: Kysely<Database>) {
        this.db = db;
    }

    async login(data: IAuthLogin) {
        console.log("data", data)
        const result = await this.db
            .selectFrom('user')
            .selectAll()
            .where('user.username', '=', data.username)
            .executeTakeFirstOrThrow();

        if (!result) {
            throw new HttpRequestError(StatusCodes.UNAUTHORIZED, 'Username atau password salah', 'Unauthorized');
        }

        return result;
    }

    async register(data: IUserCreate) {
        // check if username or email already exist
        const check = await this.db
            .selectFrom('user')
            .selectAll()
            .where('user.username', '=', data.username)
            .where('user.email', '=', data.email)
            .execute();

        if (check.length > 0) {
            throw new HttpRequestError(StatusCodes.BAD_REQUEST, 'Username atau email sudah digunakan', 'Bad Request');
        }

        const id = v4();
        const result = await this.db
            .insertInto('user')
            .values({
                ...data,
                id: id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .executeTakeFirstOrThrow();

        if (Number(result.numInsertedOrUpdatedRows) === 0) {
            throw new HttpRequestError(StatusCodes.INTERNAL_SERVER_ERROR, 'Gagal membuat user', 'Internal Server Error');
        }

        // get data 
        const user = await this.db
            .selectFrom('user')
            .selectAll()
            .where('user.id', '=', id)
            .executeTakeFirstOrThrow();

        return user;
    }

    async update(id: string, data: IUserUpdate) {
        const result = await this.db
            .updateTable('user')
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where('user.id', 'is', id)
            .executeTakeFirstOrThrow();

        return result;
    }

    async delete(id: string) {
        const result = await this.db
            .updateTable('user')
            .set({
                deletedAt: new Date(),
            })
            .where('user.id', 'is', id)
            .executeTakeFirstOrThrow();

        return result;
    }
}