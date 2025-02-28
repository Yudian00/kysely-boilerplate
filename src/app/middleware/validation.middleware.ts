// src/middleware/validationMiddleware.ts
import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {JwtPayload} from "jsonwebtoken";
import {jwtDecode} from "jwt-decode";
import {z, ZodError, ZodIssueBase} from "zod";
import {db} from "../../db/database";
import {HttpError, HttpMessage} from "../../helper/httpMessage";
import {errorResponse} from "../../helper/response";

export async function isUserValid(userId: string): Promise<boolean> {
    const result = await db
        .selectFrom("user")
        .select("id")
        .where("id", "=", userId)
        .where("deletedAt", "is", null)
        .executeTakeFirst();

    return !!result;
}

export function validateData(schema: z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: ZodIssueBase) => ({
                    field: issue.path.join("."),
                    message: `${issue.path.join(".")} is ${issue.message}`,
                }))
                errorResponse(req, res, HttpMessage.VALIDATION_ERROR, errorMessages, StatusCodes.BAD_REQUEST);
                return
            } else {
                errorResponse(req, res, HttpMessage.INTERNAL_SERVER_ERROR, HttpError.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
                return
            }
        }
    };
}

export function verifyJWTToken() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers["authorization"];
            if (!token) {
                errorResponse(req, res, "Unauthorized", "Invalid Token", StatusCodes.UNAUTHORIZED);
                return
            }

            const decoded = token?.split(" ")[1];
            const user: JwtPayload & { id: string } = jwtDecode(decoded);
            if (!user) {
                errorResponse(req, res, "Unauthorized", "Invalid Token", StatusCodes.UNAUTHORIZED);
                return
            }

            // Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (user.exp < currentTime) {
                errorResponse(req, res, "Unauthorized", "Token Expired", StatusCodes.UNAUTHORIZED);
                return
            }

            // check Employee id in database
            const data = await isUserValid(user.id);
            if (!data) {
                errorResponse(req, res, "Unauthorized", "User Not Found", StatusCodes.UNAUTHORIZED);
                return
            }

            next();
        } catch (error) {
            errorResponse(req, res, "Unauthorized", error.toString(), StatusCodes.UNAUTHORIZED);
            return
        }
    }
}