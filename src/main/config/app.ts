import express from 'express'
import setupMiddlewares from './setup-middlewares'

const app = express()

setupMiddlewares(app)

export { app }
