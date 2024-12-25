import { NextFunction, Request, Response, Router } from "express";
import { successResponse } from "../../../helper/response";
import { EmployeeUsecase } from "./employee.usecase";
import { validateData, verifyAdminJWTToken } from "../../middleware/validation.middleware";
import { employeeCreateDTO } from "./employee.dto";

export class EmployeeRouter {
    private readonly router: Router;
    private readonly employeeUseCase: EmployeeUsecase;

    constructor(router: Router, employeeUseCase: EmployeeUsecase) {
        this.router = router;
        this.employeeUseCase = employeeUseCase;

        this.setupRoute();
    }

    private setupRoute() {
        const newRouter = Router();
        this.router.use('/employee', newRouter);

        newRouter.get('/', verifyAdminJWTToken(), this.findAll.bind(this));
        newRouter.get('/:id', verifyAdminJWTToken(), this.findById.bind(this));
        newRouter.post('/', verifyAdminJWTToken(), validateData(employeeCreateDTO), this.create.bind(this));
    }

    async findAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.employeeUseCase.findAll();
            return successResponse(res, result, 'Berhasil mendapatkan data');
        } catch (error) {
            return next(error)
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await this.employeeUseCase.findById(id);
            return successResponse(res, result, 'Berhasil mendapatkan data');
        } catch (error) {
            return next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const parse = employeeCreateDTO.safeParse(req.body)
            const body = parse.data

            const result = await this.employeeUseCase.create(body)
            return successResponse(res, result, 'Berhasil membuat data');
        } catch (error) {
            return next(error)
        }
    }
}