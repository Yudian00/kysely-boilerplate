import cors from 'cors'
import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import express, { Application, Router } from 'express'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler.middleware'
import { EmployeeRouter } from './module/employee/employee.router'
import { EmployeeUsecase } from './module/employee/employee.usecase'
import { EmployeeRepository } from './module/employee/employee.repository'
import { db } from '../db/database'
import { AuthRepository } from './module/auth/auth.store'
import { AuthUsecase } from './module/auth/auth.usecase'
import { AuthRouter } from './module/auth/auth.router'

export class App {
    public app: Application

    constructor() {
        this.app = express()
        this.app.use(cors())
        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        this.setupRoute()
        this.app.use(errorHandler)

        dayjs.extend(utc)
        dayjs.extend(tz)
        dayjs.tz.setDefault('Asia/Jakarta')
    }

    private setupRoute(): void {
        console.log("Setting up routes")
        const router = Router()
        this.app.use('/api/v1', router)


        // setup auth module 
        const authRepository = new AuthRepository(db)
        const authUsecase = new AuthUsecase(authRepository)
        new AuthRouter(router, authUsecase)

        // setup employee module
        const employeeRepository = new EmployeeRepository(db)
        const employeUsecase = new EmployeeUsecase(employeeRepository)
        new EmployeeRouter(router, employeUsecase)
    }

}