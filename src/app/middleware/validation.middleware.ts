// src/middleware/validationMiddleware.ts
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jwtDecode } from 'jwt-decode';
import { z, ZodError } from 'zod';
import { HttpError, HttpMessage } from '../../helper/httpMessage';
import { errorResponse } from '../../helper/response';
import { IUser } from '../module/auth/auth.interface';
import { db } from '../../db/database';


export async function isUserValid(userId: string): Promise<boolean> {
    const result = await db
        .selectFrom('user')
        .select('id')
        .where('id', '=', userId)
        .where('deletedAt', 'is', null)
        .executeTakeFirst();

    return !!result;
}


export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    field: issue.path.join('.'),
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                errorResponse(req, res, HttpMessage.VALIDATION_ERROR, errorMessages, StatusCodes.BAD_REQUEST);
            } else {
                errorResponse(req, res, HttpMessage.INTERNAL_SERVER_ERROR, HttpError.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
    };
}


export function verifyAdminJWTToken() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                errorResponse(req, res, 'Unauthorized', 'token not found', StatusCodes.UNAUTHORIZED);
            }

            const decoded = token?.split(' ')[1];
            const user: IUser = jwtDecode(decoded);
            if (!user) {
                errorResponse(req, res, 'Unauthorized', 'token not found', StatusCodes.UNAUTHORIZED);
            }

            // check Employee id in database
            const data = await isUserValid(user.id);
            if (!data) {
                errorResponse(req, res, 'Unauthorized', 'user not found', StatusCodes.UNAUTHORIZED);
            }

            next();
        } catch (error) {
            errorResponse(req, res, HttpMessage.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}