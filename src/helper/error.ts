import {Request} from "express";
import {db} from "../db/database";

class BaseError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    }
}

export class HttpRequestError extends BaseError {
    constructor(public status: number, public message: string, public error?: any) {
        super(message);

        this.name = "HttpRequestError";
        this.status = status || 500;
        this.message = message || "Internal Server Error";
        this.error = error || null;
    }
}

export async function logErrorToDB(req: Request, generatedErrorId: string, errorStack: string | undefined) {
    const endpoint = `${req.method} ${req.originalUrl}`;
    await db.insertInto("auditError")
        .values({
            id: generatedErrorId,
            endpoint: endpoint,
            errorTrace: errorStack || "No error message",
        })
        .executeTakeFirst();
}