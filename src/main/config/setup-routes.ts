import { Express, Router } from 'express'
import accountRoutes from '@src/main/routes/account/account-routes'

export const setupRoutes = (app: Express): void => {
  const routes = [accountRoutes]

  const router = Router()
  app.use('/api', router)

  routes.forEach((route) => route(router))
}
