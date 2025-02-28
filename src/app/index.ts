import cors from "cors"
import dayjs from "dayjs"
import tz from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import express, {Application, Router} from "express"
import morgan from "morgan"
import {db} from "../db/database"
import {errorHandler} from "./middleware/errorHandler.middleware"
import {AuthRepository, AuthRouter, AuthUsecase} from "./module/auth";
import {UserRepository, UserRouter, UserUsecase} from "./module/user";
import limitter from "../helper/limitter";

export class App {
    public app: Application

    constructor() {
        this.app = express()
        this.app.use(cors())
        this.app.use(limitter)
        this.app.use(morgan("dev"))
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))

        this.setupRoute()
        this.app.use(errorHandler)

        dayjs.extend(utc)
        dayjs.extend(tz)
        dayjs.tz.setDefault("Asia/Jakarta")
    }

    private setupRoute(): void {
        this.app.get("/", (_, res) => {
            res.status(200).json({
                success: true,
                message: "Welcome to API",
                version: "1.0.0",
            });
            return
        })

        const router = Router()
        this.app.use("/api/v1", router)

        // setup auth module
        const authRepository = new AuthRepository(db)
        const authUsecase = new AuthUsecase(authRepository)
        new AuthRouter(router, authUsecase)

        // setup user module
        const userRepository = new UserRepository(db)
        const userUsecase = new UserUsecase(userRepository)
        new UserRouter(router, userUsecase)
    }

}