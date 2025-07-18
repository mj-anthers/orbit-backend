import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import { routeLogFormat, routeLogStream } from './src/utils/index.js'
import defaultRouter from './src/routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

logger.token('body', (req) => JSON.stringify(req.body))
logger.token('query', (req) => JSON.stringify(req.query))
logger.token('headers', (req) => JSON.stringify(req.headers))

const app = express()

// ✅ Middleware
app.use(logger(routeLogFormat, { stream: routeLogStream }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// ✅ Health check route
app.get('/health', (req, res) => res.sendStatus(200))

app.use('/orbit/v1', defaultRouter)
// ✅ Parse JWT before protected routes
//app.use(parseJWTToken)

export default app
