import { routeAdapter } from '@src/main/adapters/express/express-route-adapter'
import { makeSignUpController } from '@src/main/factories/signup/signup-controller-factory'
import { Router } from 'express'

const signUpController = makeSignUpController()
const signUpRouteAdapted = routeAdapter(signUpController)

export default (router: Router) => {
  router.post('/signup', signUpRouteAdapted)
}
