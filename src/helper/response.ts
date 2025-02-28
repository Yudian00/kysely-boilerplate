import {Request, Response} from "express";
import {APIResponse} from "../types/response";
import {HttpMessage} from "./httpMessage";
import {StatusCodes} from "http-status-codes";
import {jwtDecode, JwtPayload} from "jwt-decode";

export function getUserIdFromJWT(req: Request, res: Response) {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return errorResponse(req, res, "Unauthorized", "Invalid Token", StatusCodes.UNAUTHORIZED);
        }

        const decoded = token?.split(" ")[1];
        const user: JwtPayload & { id: string } = jwtDecode(decoded);
        if (!user) {
            return errorResponse(req, res, "Unauthorized", "Invalid Token", StatusCodes.UNAUTHORIZED);
        }

        return user.id;
    } catch (error) {
        return errorResponse(req, res, HttpMessage.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export function successResponse<T>(res: Response, data: T, message: string) {
    const response: APIResponse<T> = {
        success: true,
        message: message || HttpMessage.GET_SUCCESS,
        data: data ?? null,
    }

    return res.status(200).json(response)
}

export function errorResponse(_: Request, res: Response, message: string, error: any, code?: number) {
    const response = {
        success: false,
        message: message,
        error: error,
    }

    return res.status(code || 500).json(response)
}