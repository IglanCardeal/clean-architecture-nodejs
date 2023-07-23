import { Router } from 'express'
import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import { makeAddSurveyController } from '@src/main/factories/controllers/survey'
import { middlewareAdapter } from '@src/main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@src/main/factories/controllers/middlewares/auth/auth-middleware-factory'
import { makeLoadSurveysController } from '@src/main/factories/controllers/survey/load/load-surveys-controller-factory'

// `/api/SURVEYS_ROUTE_PREFIX/...`
export const SURVEYS_ROUTE_PREFIX = 'surveys'

export const surveysRoutesSetup = (router: Router) => {
  const adminAuth = middlewareAdapter(makeAuthMiddleware('admin'))
  const userAuth = middlewareAdapter(makeAuthMiddleware())

  // create a survey
  router.post(
    `/${SURVEYS_ROUTE_PREFIX}`,
    adminAuth,
    routeAdapter(makeAddSurveyController())
  )

  // list all surveys
  router.get(
    `/${SURVEYS_ROUTE_PREFIX}`,
    userAuth,
    routeAdapter(makeLoadSurveysController())
  )
}
