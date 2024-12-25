import { IAuthLogin, IAuthRegister } from "./auth.dto"
import { IUser } from "./auth.interface"
import { AuthRepository } from "./auth.store"

export class AuthUsecase {
    private readonly authRepository: AuthRepository

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository
    }

    async login(data: IAuthLogin) {
        const result = await this.authRepository.login(data)
        return result
    }

    async register(data: IAuthRegister) {
        const result = await this.authRepository.register(data)
        delete result.password

        return result
    }

    async update(id: string, data: IUser) {
        const result = await this.authRepository.update(id, data)
        return result
    }

    async delete(id: string) {
        const result = await this.authRepository.delete(id)
        return result
    }
}