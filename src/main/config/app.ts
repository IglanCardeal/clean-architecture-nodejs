import express from 'express'
import setupMiddlewares from './setup-middlewares'
import setupSwagger from './setup-swagger'
import { setupRoutes } from './setup-routes'
import setupStatic from '../middlewares/static'

const app = express()

setupStatic(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export { app }
