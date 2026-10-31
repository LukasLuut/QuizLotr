// src/app.ts
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import routes from './routes'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler'

const app = express()
app.disable('x-powered-by')
app.use(helmet())
// Só as origens do .env (CORS_ORIGIN) podem chamar a API pelo navegador
app.use(cors({ origin: env.corsOrigins }))
app.use(express.json({ limit: '20kb' }))
app.use(routes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
