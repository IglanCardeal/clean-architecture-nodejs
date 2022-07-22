import express from 'express'
import setupMiddlewares from './setup-middlewares'
import { setupRoutes } from './setup-routes'

const app = express()

setupMiddlewares(app)
setupRoutes(app)

export { app }
