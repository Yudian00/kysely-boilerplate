import {IAuthChangePassword, IAuthLogin, IAuthRegister} from "./auth.dto"
import {AuthRepository} from "./auth.repository"
import bcrypt from "bcrypt";
import {HttpRequestError} from "../../../helper/error";
import jwt from "jsonwebtoken";

export class AuthUsecase {
    private readonly authRepository: AuthRepository

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository
    }

    async login(data: IAuthLogin) {
        const result = await this.authRepository.login(data)

        // check password
        const isPasswordMatch = await bcrypt.compare(data.password, result.password)
        if (!isPasswordMatch) {
            throw new HttpRequestError(400, "Kata sandi yang dimasukan tidak sesuai", "Password not match")
        }

        const token = jwt.sign(result, process.env.JWT_SECRET, {expiresIn: "1D"})
        return {
            id: result.id,
            username: result.username,
            email: result.email,
            token,
        }
    }

    async register(data: IAuthRegister) {
        const result = await this.authRepository.register(data)
        delete result.password

        return result
    }

    async changePassword(data: IAuthChangePassword) {
        const user = await this.authRepository.getUserInformationByEmail(data.email)

        // encrypt password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        data.newPassword = bcrypt.hashSync(data.newPassword, salt);

        // compare old password
        const isMatch = bcrypt.compareSync(data.oldPassword, user.password)
        if (!isMatch) {
            throw new HttpRequestError(400, "Old Password is incorrect", "Bad Request")
        }

        // update password
        await this.authRepository.changePassword(data)
        const result = await this.authRepository.getUserInformationById(user.id)

        delete result.password
        return result
    }

}