import {Kysely} from "kysely";
import {v4} from "uuid";
import {IAuthChangePassword, IAuthLogin} from "./auth.dto";
import {HttpRequestError} from "../../../helper/error";
import {StatusCodes} from "http-status-codes";
import {DB} from "../../../db/db";
import {IUserCreate} from "../user/user.dto";

export class AuthRepository {
    private readonly db: Kysely<DB>

    constructor(db: Kysely<DB>) {
        this.db = db;
    }

    async login(data: IAuthLogin) {
        const result = await this.db
            .selectFrom("user")
            .select([
                "user.id",
                "user.username",
                "user.email",
                "user.password",
            ])
            .where("user.username", "=", data.username)
            .executeTakeFirst();

        if (!result) {
            throw new HttpRequestError(StatusCodes.UNAUTHORIZED, "Username atau password salah", "Unauthorized");
        }

        return result;
    }

    async register(data: IUserCreate) {
        // check if username or email already exist
        const check = await this.db
            .selectFrom("user")
            .selectAll()
            .where("user.username", "=", data.username)
            .where("user.email", "=", data.email)
            .execute();

        if (check.length > 0) {
            throw new HttpRequestError(StatusCodes.BAD_REQUEST, "Username atau email sudah digunakan", "Bad Request");
        }

        const id = v4();
        const result = await this.db
            .insertInto("user")
            .values({
                ...data,
                id: id,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .executeTakeFirstOrThrow();

        if (Number(result.numInsertedOrUpdatedRows) === 0) {
            throw new HttpRequestError(StatusCodes.INTERNAL_SERVER_ERROR, "Gagal membuat user", "Internal Server Error");
        }

        // get data
        return await this.getUserInformationById(id);
    }

    async getUserInformationById(id: string) {
        const result = await this.db
            .selectFrom("user")
            .select([
                "user.id",
                "user.email",
                "user.username",
                "user.name",
                "user.password",
            ])
            .where("user.id", "=", id)
            .executeTakeFirst();

        if (!result) {
            throw new HttpRequestError(404, "Data tidak ditemukan", "Not Found");
        }

        return result
    }

    async getUserInformationByEmail(email: string) {
        const result = await this.db.selectFrom("user")
            .select(["user.id", "user.password"])
            .where("user.email", "=", email)
            .where("user.deletedAt", "is", null)
            .executeTakeFirst();

        if (!result) {
            throw new HttpRequestError(404, "Data tidak ditemukan", "Not Found");
        }

        return result
    }

    async changePassword(data: IAuthChangePassword) {
        await this.db.updateTable("user")
            .set({
                password: data.newPassword,
                updatedAt: new Date(),
            })
            .where("email", "=", data.email)
            .where("user.deletedAt", "is", null)
            .execute();
    }
}