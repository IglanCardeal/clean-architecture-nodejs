import { Router } from 'express'
import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import { makeAddSurveyController } from '@src/main/factories/controllers/survey'
import { middlewareAdapter } from '@src/main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@src/main/factories/controllers/middlewares/auth/auth-middleware-factory'

// `/api/SURVEYS_ROUTE_PREFIX/...`
export const SURVEYS_ROUTE_PREFIX = 'surveys'

export const surveysRoutesSetup = (router: Router) => {
  const adminAuth = middlewareAdapter(makeAuthMiddleware('admin'))
  router.post(
    `/${SURVEYS_ROUTE_PREFIX}`,
    adminAuth,
    routeAdapter(makeAddSurveyController())
  )
}
