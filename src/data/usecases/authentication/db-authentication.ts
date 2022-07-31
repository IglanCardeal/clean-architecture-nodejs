import {
  AuthenticationUseCase,
  AuthModel
} from '@src/domain/usecases/authentication'
import { failure, success } from '@src/shared'
import { LoadAccountByEmailRepository } from './db-authentication-protocols'
import {
  DbAuthenticationUseCaseResult,
  LoadAccountByEmailRepositoryError
} from './db-authentication-result'

export class DbAuthenticationUseCase
  implements AuthenticationUseCase<DbAuthenticationUseCaseResult>
{
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth(authModel: AuthModel): Promise<DbAuthenticationUseCaseResult> {
    try {
      await this.loadAccountByEmailRepository.load(authModel.email)
    } catch (error: any) {
      return failure(new LoadAccountByEmailRepositoryError(error.stack))
    }
    return success('')
  }
}
