import {
  LoadAccountByTokenUseCase,
  LoadAccountByTokenUseCaseProps
} from '@src/domain/usecases/account'
import { DbLoadAccountByTokenUsecaseResult } from '@src/presentation/middlewares/auth-middleware-protocols'
import { success } from '@src/shared/either'
import { mockAccountModel } from '@src/shared/helpers/mocks'

export const mockLoadAccountByTokenUseCase = () => {
  class LoadAccountByTokenUseCaseStub
    implements LoadAccountByTokenUseCase<DbLoadAccountByTokenUsecaseResult>
  {
    async load({
      accessToken: _accessToken,
      role: _role
    }: LoadAccountByTokenUseCaseProps): Promise<DbLoadAccountByTokenUsecaseResult> {
      return success(mockAccountModel())
    }
  }
  return new LoadAccountByTokenUseCaseStub()
}
