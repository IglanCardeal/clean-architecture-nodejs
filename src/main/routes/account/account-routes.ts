import { Router } from 'express'
import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import {
  makeLoginController,
  makeSignUpController
} from '@src/main/factories/controllers/account'

// `/api/ACCOUNT_ROUTE_PREFIX/...`
export const ACCOUNT_ROUTE_PREFIX = 'account'

export const accountRoutesSetup = (router: Router) => {
  router.post(
    `/${ACCOUNT_ROUTE_PREFIX}/signup`,
    routeAdapter(makeSignUpController())
  )
  router.post(
    `/${ACCOUNT_ROUTE_PREFIX}/login`,
    routeAdapter(makeLoginController())
  )
}
