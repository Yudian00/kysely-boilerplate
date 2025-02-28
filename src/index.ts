import * as dotenv from "dotenv"
import http from "http"
import {errorResponse} from "./helper/response"
import {App} from "./app"
import logger from "./helper/logger";

dotenv.config({
    path: "../.env"
})

const port = process.env.PORT || 3000
const startServer = () => {
    try {
        const app = new App()
        const httpServer = http.createServer(app.app)

        // Handle 404
        app.app.all("*", (req, res) => {
            logger.warn("Endpoint not found:", req.url)
            errorResponse(req, res, "Not Found", "Endpoint not found", 404)
        })

        httpServer.listen(port, () => {
            logger.info(`Server is running on http://localhost:${port}`)
        })
    } catch (error) {
        logger.error("Error starting the server:", error)
    }
}

startServer()
