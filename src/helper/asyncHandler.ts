import {NextFunction, Request, Response, Router} from "express";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export const wrapAsyncRoutes = (router: Router) => {
    const methods = ["get", "post", "put", "delete", "patch"];

    methods.forEach(method => {
        const originalMethod = (router as any)[method];

        (router as any)[method] = function (path: string, ...handlers: any[]) {
            const wrappedHandlers = handlers.map(handler =>
                typeof handler === "function" ? asyncHandler(handler) : handler
            );
            return originalMethod.call(this, path, ...wrappedHandlers);
        };
    });
};