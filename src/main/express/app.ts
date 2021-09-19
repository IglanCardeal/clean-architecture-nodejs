import express from 'express'
import { middlewaresSetup } from './middlewares-setup'
import { routesSetup } from './routes-setup'

const app = express()
middlewaresSetup(app)
routesSetup(app)

export { app }
