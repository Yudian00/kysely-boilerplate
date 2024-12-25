import * as dotenv from 'dotenv'
import http from 'http'
import { errorResponse } from './helper/response'
import { App } from './app'

dotenv.config({
    path: '../.env'
})

const port = process.env.PORT || 3000
const startServer = async () => {
    try {
        const app = new App()
        const httpServer = http.createServer(app.app)

        // Handle 404
        app.app.all('*', (req, res) => {
            console.log('Endpoint not found:', req.url)
            return errorResponse(req, res, 'Not Found', 'Endpoint not found', 404)
        })

        httpServer.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })
    } catch (error) {
        console.error('Error starting the server:', error)
    }
}


startServer().then(r => r)
