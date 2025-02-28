import { rateLimit } from "express-rate-limit"
import { errorResponse } from "./response"

const minutes = 1

const limitter = rateLimit({
    windowMs: minutes * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return errorResponse(req, res, "Silahkan coba lagi nanti", "Too many requests, please try again later.")
    }
})

export default limitter