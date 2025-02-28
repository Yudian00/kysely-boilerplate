import bcrypt from "bcrypt";
import {Request, Response, Router} from "express";

import {successResponse} from "../../../helper/response";
import {authChangePassword, authLoginSchema, authRegisterESchema} from "./auth.dto";
import {AuthUsecase} from "./auth.usecase";
import {validateData, verifyJWTToken} from "../../middleware/validation.middleware";
import {wrapAsyncRoutes} from "../../../helper/asyncHandler";

export class AuthRouter {
    private readonly router: Router;
    private readonly authUsecase: AuthUsecase

    constructor(router: Router, authUsecase: AuthUsecase) {
        this.router = router;
        this.authUsecase = authUsecase
        this.setupRouter();
    }

    async login(req: Request, res: Response) {
        const parse = authLoginSchema.safeParse(req.body)
        const body = parse.data
        const data = {
            username: body.username,
            password: body.password
        }

        const result = await this.authUsecase.login(data)
        successResponse(res, result, "Login Berhasil!")

    }

    async register(req: Request, res: Response) {
        const saltRounds = 10;
        const parse = authRegisterESchema.safeParse(req.body)
        const body = parse.data

        // encrypt password
        const salt = bcrypt.genSaltSync(saltRounds);
        body.password = bcrypt.hashSync(body.password, salt);

        const result = await this.authUsecase.register(body)
        delete result.password
        successResponse(res, result, "Register Berhasil!")
    }

    async changePassword(req: Request, res: Response) {
        const parse = authChangePassword.safeParse(req.body)
        const body = parse.data
        const data = {
            email: body.email,
            oldPassword: body.oldPassword,
            newPassword: body.newPassword
        }

        const result = await this.authUsecase.changePassword(data)
        successResponse(res, result, "Password Berhasil diubah!")
    }

    private setupRouter() {
        const newRouter = Router()
        wrapAsyncRoutes(newRouter);

        this.router.use("/auth", newRouter)

        newRouter.post("/login", validateData(authLoginSchema), this.login.bind(this))
        newRouter.post("/register", verifyJWTToken(), validateData(authRegisterESchema), this.register.bind(this))
        newRouter.post("/register-bypass", validateData(authRegisterESchema), this.register.bind(this))
        newRouter.post("/change-password", validateData(authChangePassword), this.changePassword.bind(this))
    }
}