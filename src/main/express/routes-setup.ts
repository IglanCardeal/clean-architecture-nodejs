import { Express, Router } from 'express'
import fg from 'fast-glob'

export const routesSetup = (app: Express) => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**-route.ts').map(async (file) => {
    const route = (await import(`../../../${file}`)).default
    route(router)
  })
}
