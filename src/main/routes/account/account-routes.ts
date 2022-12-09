import { Router } from 'express'
import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import {
  makeLoginController,
  makeSignUpController
} from '@src/main/factories/account'

const signUpRouteAdapted = routeAdapter(makeSignUpController())
const loginRouteAdapted = routeAdapter(makeLoginController())

export default (router: Router) => {
  router.post('/signup', signUpRouteAdapted)
  router.post('/login', loginRouteAdapted)
}
