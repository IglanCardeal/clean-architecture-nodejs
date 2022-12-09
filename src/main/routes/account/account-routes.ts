import { Router } from 'express'
import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import {
  makeLoginController,
  makeSignUpController
} from '@src/main/factories/account'

const signUpRouteAdapted = routeAdapter(makeSignUpController())
const loginRouteAdapted = routeAdapter(makeLoginController())

// `/api/ACCOUNT_ROUTE_PREFIX/...`
export const ACCOUNT_ROUTE_PREFIX = 'account'

export const accountRoutesSetup = (router: Router) => {
  router.post(`/${ACCOUNT_ROUTE_PREFIX}/signup`, signUpRouteAdapted)
  router.post(`/${ACCOUNT_ROUTE_PREFIX}/login`, loginRouteAdapted)
}
