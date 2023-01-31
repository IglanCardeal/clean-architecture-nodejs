import { Router } from 'express'
import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import { makeAddSurveyController } from '@src/main/factories/controllers/survey'

// `/api/SURVEYS_ROUTE_PREFIX/...`
export const SURVEYS_ROUTE_PREFIX = 'surveys'

export const surveysRoutesSetup = (router: Router) => {
  router.post(
    `/${SURVEYS_ROUTE_PREFIX}`,
    routeAdapter(makeAddSurveyController())
  )
}
