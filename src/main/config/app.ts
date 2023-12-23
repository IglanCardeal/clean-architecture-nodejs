import express from 'express'
import setupMiddlewares from './setup-middlewares'
import setupSwagger from './setup-swagger'
import { setupRoutes } from './setup-routes'

const app = express()

setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export { app }
