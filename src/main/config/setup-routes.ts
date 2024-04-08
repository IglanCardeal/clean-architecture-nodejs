import { Express, Router } from 'express'
import { accountRoutesSetup, surveysRoutesSetup } from '@src/main/routes'

export const setupRoutes = (app: Express): void => {
  const routesSetup = [accountRoutesSetup, surveysRoutesSetup]

  const router = Router()
  app.use('/api', router)

  routesSetup.forEach((route) => route(router))
}
