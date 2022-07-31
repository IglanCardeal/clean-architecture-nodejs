import { AccountNotFoundError } from '@src/domain/errors'
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
    let account

    try {
      account = await this.loadAccountByEmailRepository.load(authModel.email)
    } catch (error: any) {
      return failure(new LoadAccountByEmailRepositoryError(error.stack))
    }

    if (!account) {
      return failure(new AccountNotFoundError())
    }

    return success('')
  }
}
