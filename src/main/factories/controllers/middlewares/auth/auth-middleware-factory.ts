import { makeDbLoadAccountByTokenUsecase } from '@src/main/factories/usecases/load-account-by-token/db-load-account-by-token-factory'
import { AuthMiddleware } from '@src/presentation/middlewares/auth-middleware'
import { Controller } from '@src/presentation/protocols'

export const makeAuthMiddleware = (role?: string): Controller => {
  const loadAccountByTokenUseCase = makeDbLoadAccountByTokenUsecase()
  return new AuthMiddleware(loadAccountByTokenUseCase, role)
}
