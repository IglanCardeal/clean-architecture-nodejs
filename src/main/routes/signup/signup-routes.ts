import { routeAdapter } from '@src/main/adapters/express-route-adapter'
import { makeSignUpController } from '@src/main/factories/signup-controller'
import { Router } from 'express'

const signUpController = makeSignUpController()
const signUpRouteAdapted = routeAdapter(signUpController)

export default (router: Router) => {
  router.post('/signup', signUpRouteAdapted)
}
