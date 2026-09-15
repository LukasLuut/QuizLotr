// src/app.ts
import express from 'express'
import { config } from 'dotenv'
import routes from './routes'
import cors from "cors";

config()
const app = express()
app.use(cors())
// app.use(cors({ origin: "http://127.0.0.1:5501/"})) Usar para sites específicos
app.use(express.json())
app.use(routes)

export default app