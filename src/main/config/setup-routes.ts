import { Express, Router } from 'express'
import { accountRoutesSetup } from '@src/main/routes'

export const setupRoutes = (app: Express): void => {
  const routesSetup = [accountRoutesSetup]

  const router = Router()
  app.use('/api', router)

  routesSetup.forEach((route) => route(router))
}
