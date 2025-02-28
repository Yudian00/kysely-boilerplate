import {UserRepository} from "./user.repository";
import {IUserCreateDTO, IUserFilter, IUserUpdateDTO} from "./user.dto";
import {v4} from "uuid";
import bcrypt from "bcrypt";

export class UserUsecase {
    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async findAll(queryParams: any, page: number, limit: number) {
        const filters: IUserFilter = {
            ...queryParams,
            page,
            limit
        }

        return await this.userRepository.findAll(filters)
    }

    async findById(id: string) {
        return await this.userRepository.findById(id)
    }

    async create(data: IUserCreateDTO, createdBy: string) {
        // hash password
        const salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);

        const id = v4()
        const createdData = {
            id: id,
            name: data.name,
            roleId: data.roleId,
            username: data.username,
            password: data.password,
            email: data.email,
            updatedAt: new Date(),
            createdAt: new Date(),
            updatedBy: createdBy,
            createdBy: createdBy,
            deletedBy: null,
            deletedAt: null
        };

        await this.userRepository.create(createdData)
        return await this.findById(id)
    }

    async update(id: string, data: IUserUpdateDTO, updatedBy: string) {
        if (data.password) {
            // hash password
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }

        const existing = await this.userRepository.findById(id)
        const updatedData = {
            ...existing,
            ...data,
            updatedBy: updatedBy,
            updatedAt: new Date()
        };

        await this.userRepository.update(id, updatedData)
        return await this.findById(id)
    }

    async delete(id: string, deletedBy: string) {
        return await this.userRepository.delete(id, deletedBy)
    }
}