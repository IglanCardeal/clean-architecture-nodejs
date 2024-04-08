import { Router } from 'express'
import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import { makeAddSurveyController } from '@src/main/factories/controllers/survey'
import { makeLoadSurveysController } from '@src/main/factories/controllers/survey/load/load-surveys-controller-factory'
import { adminAuth, auth } from '@src/main/middlewares/auth'
import { makeSaveSurveyResultController } from '@src/main/factories/controllers/survey/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '@src/main/factories/controllers/survey/load-survey-result/load-survey-result-controller-factory'

// `/api/SURVEYS_ROUTE_PREFIX/...`
export const SURVEYS_ROUTE_PREFIX = 'surveys'

export const surveysRoutesSetup = (router: Router) => {
  // create a survey
  router.post(
    `/${SURVEYS_ROUTE_PREFIX}`,
    adminAuth,
    routeAdapter(makeAddSurveyController())
  )

  // list all surveys
  router.get(
    `/${SURVEYS_ROUTE_PREFIX}`,
    auth,
    routeAdapter(makeLoadSurveysController())
  )

  // save survey result
  router.put(
    `/${SURVEYS_ROUTE_PREFIX}/:surveyId/results`,
    auth,
    routeAdapter(makeSaveSurveyResultController())
  )

  // load survey result by id
  router.get(
    `/${SURVEYS_ROUTE_PREFIX}/:surveyId/results`,
    auth,
    routeAdapter(makeLoadSurveyResultController())
  )
}
