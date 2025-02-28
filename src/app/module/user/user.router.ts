import {UserUsecase} from "./user.usecase";
import {Request, Response, Router} from "express";
import {HttpMessage} from "../../../helper/httpMessage";
import {validateData} from "../../middleware/validation.middleware";
import {getUserIdFromJWT, successResponse} from "../../../helper/response";
import {userCreateDTO, userUpdateDTO} from "./user.dto";
import {wrapAsyncRoutes} from "../../../helper/asyncHandler";

export class UserRouter {
    private readonly router: Router;
    private readonly userUseCase: UserUsecase;

    constructor(router: Router, userUseCase: UserUsecase) {
        this.router = router;
        this.userUseCase = userUseCase;

        this.setupRoute();
    }

    async findAll(req: Request, res: Response) {
        const query = req.query as any;
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 10

        const result = await this.userUseCase.findAll(query, page, limit);
        successResponse(res, result, HttpMessage.GET_SUCCESS);

    }

    async findById(req: Request, res: Response) {
        const {id} = req.params;
        const result = await this.userUseCase.findById(id);
        successResponse(res, result, HttpMessage.GET_SUCCESS);

    }

    async create(req: Request, res: Response) {
        const userId = getUserIdFromJWT(req, res) as string
        const parse = userCreateDTO.safeParse(req.body)
        const body = parse.data

        const result = await this.userUseCase.create(body, userId)
        successResponse(res, result, HttpMessage.CREATE_SUCCESS);
    }

    async update(req: Request, res: Response) {
        const {id} = req.params;
        const userId = getUserIdFromJWT(req, res) as string

        const parse = userUpdateDTO.safeParse(req.body)
        const body = parse.data

        const result = await this.userUseCase.update(id, body, userId)
        successResponse(res, result, HttpMessage.UPDATE_SUCCESS);
    }

    async delete(req: Request, res: Response) {
        const {id} = req.params;
        const userId = getUserIdFromJWT(req, res) as string

        await this.userUseCase.delete(id, userId)
        successResponse(res, null, HttpMessage.DELETE_SUCCESS);
    }

    private setupRoute() {
        const newRouter = Router();
        wrapAsyncRoutes(newRouter);

        this.router.use("/user", newRouter);

        newRouter.get("/", this.findAll.bind(this));
        newRouter.get("/:id", this.findById.bind(this));
        newRouter.post("/", validateData(userCreateDTO), this.create.bind(this));
        newRouter.put("/:id", validateData(userUpdateDTO), this.update.bind(this));
        newRouter.delete("/:id", this.delete.bind(this));
    }
}