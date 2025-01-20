import { UserRepository } from "./user.repository"

export class UserUsecase {
    private readonly UserRepository: UserRepository

    constructor(UserRepository: UserRepository) {
        this.UserRepository = UserRepository
    }

    async findById(id: string) {
        const result = await this.UserRepository.findById(id)
        return result
    }
}