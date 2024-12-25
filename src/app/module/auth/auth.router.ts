import bcrypt from 'bcrypt';
import { NextFunction, Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { successResponse } from "../../../helper/response";
import { authLoginSchema, authRegisterESchema } from "./auth.dto";
import { AuthUsecase } from "./auth.usecase";
import { validateData, verifyAdminJWTToken } from '../../middleware/validation.middleware';

export class AuthRouter {
    private readonly router: Router;
    private readonly authUsecase: AuthUsecase

    constructor(router: Router, authUsecase: AuthUsecase) {
        this.router = router;
        this.authUsecase = authUsecase
        this.setupRouter();
    }

    private setupRouter() {
        const newRouter = Router()
        this.router.use('/auth', newRouter)

        newRouter.post('/login', validateData(authLoginSchema), this.login.bind(this))
        newRouter.post('/register', verifyAdminJWTToken(), validateData(authRegisterESchema), this.register.bind(this))
        newRouter.post('/register-bypass', validateData(authRegisterESchema), this.register.bind(this))
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const parse = authLoginSchema.safeParse(req.body)
            const body = parse.data
            const data = {
                username: body.username,
                password: body.password
            }

            const result = await this.authUsecase.login(data)
            const token = jwt.sign(result, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED_TIME })
            const user = {
                id: result.id,
                username: result.username,
                email: result.email,
                token: token
            }

            return successResponse(res, user, 'Login Berhasil!')
        } catch (error) {
            return next(error)
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const saltRounds = 10;
            const parse = authRegisterESchema.safeParse(req.body)
            const body = parse.data

            // encrypt password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(body.password, salt);

            body.password = hash

            const result = await this.authUsecase.register(body)
            delete result.password
            return successResponse(res, result, 'Register Berhasil!')

        } catch (error) {
            return next(error)
        }
    }
}