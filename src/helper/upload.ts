import { NextFunction, Request, Response } from 'express'

export async function uploadFile(_: Request, __: Response, next: NextFunction) {
    try {
        console.log("=== UPLOAD FILE ===")
        next()
    } catch (error) {
        next(error)
    }
}