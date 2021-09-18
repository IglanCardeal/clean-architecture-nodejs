import express from 'express'
import { middlewaresSetup } from './middlewares-setup'

const app = express()
middlewaresSetup(app)

export { app }
