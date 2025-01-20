import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtDecode } from "jwt-decode";
import { errorResponse, successResponse } from "../../../helper/response";
import { verifyAdminJWTToken } from "../../middleware/validation.middleware";
import { IUser } from "../auth/auth.interface";
import { UserUsecase } from "./user.usecase";

export class UserRouter {
    private readonly router: Router;
    private readonly userUseCase: UserUsecase;

    constructor(router: Router, userUseCase: UserUsecase) {
        this.router = router;
        this.userUseCase = userUseCase;

        this.setupRoute();
    }

    private setupRoute() {
        const newRouter = Router();
        this.router.use('/user', newRouter);

        newRouter.get('/profile', verifyAdminJWTToken(), this.findById.bind(this));
    }


    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const user: IUser = await this.getUserFromJWT(req);
            if (!user) {
                return errorResponse(req, res, 'Unauthorized', 'token not found', StatusCodes.UNAUTHORIZED);
            }

            const result = await this.userUseCase.findById(user.id);
            return successResponse(res, result, 'Berhasil mendapatkan data');
        } catch (error) {
            return next(error)
        }
    }


    async getUserFromJWT(req: Request): Promise<IUser | undefined> {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return undefined;
            }

            const decoded = token?.split(' ')[1];
            const user: IUser = jwtDecode(decoded);
            if (!user) {
                return undefined;
            }

            return user;
        } catch (error) {
            return undefined;
        }
    }

}