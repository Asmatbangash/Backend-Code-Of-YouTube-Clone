import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {router} from './routes/user.routes.js'
const app = express()

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit:'16kb'}))
app.use(express.static("public"))
app.use(cors({origin: process.env.ORIGIN,optionsSuccessStatus: 200}))
app.use(cookieParser())

// routes 
app.use('/api/v1/user', router)

export {app}