import { Request, Response } from "express";
import { HttpRequestError } from "./error";
import fs from 'fs';
import path from 'path';
import { APIResponse } from "../types/response";

export function successResponse<T>(res: Response, data: T, message: string) {
    const response: APIResponse<T> = {
        success: true,
        message: message || 'Berhasil mendapatkan data',
        data: data ?? null,
    }

    return res.status(200).json(response)
}

export function errorResponse<T>(req: Request, res: Response, message: string, error: any, code?: number) {
    const endpoint = `${req.method} ${req.originalUrl}`;  // Capture the endpoint

    // Log error to file
    logErrorToFile(message, error, endpoint);

    if (error instanceof HttpRequestError) {
        const err = new HttpRequestError(error.status, error.message, error.error)
        return res.status(err.status).json(err)
    }

    if (error instanceof Error) {
        const err = new HttpRequestError(500, error.message, error)
        return res.status(err.status).json({
            status: false,
            message: err.message,
            error: 'Something went wrong. Please check the logs for more information',
        })
    }

    const response: APIResponse<T> = {
        success: false,
        message: message || 'Internal Server Error',
        error: error || new Error('Something went wrong. Please check the logs for more information.'),
    }

    return res.status(code || 500).json(response)
}

function logErrorToFile(message: string, error: any, endpoint: string) {
    const logDir = path.join(__dirname, '../../logs');
    const logFile = path.join(logDir, 'error.log');

    // Ensure the log directory exists
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Calculate the timestamp with +7 offset
    const now = new Date();
    const offset = 7 * 60; // +7 hours in minutes
    const localTime = new Date(now.getTime() + offset * 60 * 1000);
    const timestamp = localTime.toISOString();

    const errorDetails = typeof error === 'object' ? JSON.stringify(error, null, 2) : error;

    const logMessage = `
[${timestamp}]
Endpoint: ${endpoint}
Message: ${message}
Error: ${errorDetails}
----------------------------
`;

    // Read the existing log file content
    let existingLog = '';
    if (fs.existsSync(logFile)) {
        existingLog = fs.readFileSync(logFile, 'utf8');
    }

    // Prepend the new log message to the existing log content
    const updatedLog = logMessage + existingLog;

    // Write the updated log content back to the log file
    fs.writeFileSync(logFile, updatedLog, 'utf8');
}