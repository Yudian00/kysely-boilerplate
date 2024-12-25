import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

import { StatusCodes } from "http-status-codes";
import { HttpRequestError } from "../../helper/error";
import { errorResponse } from "../../helper/response";
import { HttpError, HttpMessage } from "../../helper/httpMessage";


export function errorHandler(err: any, req: Request, res: Response, _: NextFunction) {
    if (err instanceof HttpRequestError) {
        return errorResponse(req, res, err.message, err.error, err.status);
    }

    if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            message: HttpMessage.ERROR_FIELD_UPLOAD,
            error: HttpError.ERROR_FIELD_UPLOAD,
        });
    }

    if (err instanceof Object) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: HttpMessage.SOMETHING_WRONG,
            error: err.message,
        });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: HttpMessage.SOMETHING_WRONG,
        error: HttpError.INTERNAL_SERVER_ERROR,
    });
}