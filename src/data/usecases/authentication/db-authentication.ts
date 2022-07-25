import {
  AuthenticationUseCase,
  AuthModel
} from '@src/domain/usecases/authentication'
import { Either, success } from '@src/shared'
import {
  DbAuthenticationUseCaseResult,
  HasherError,
  RepositoryError,
  TokenEncrypterError
} from './db-authentication-result'

export class DbAuthenticationUseCase
  implements AuthenticationUseCase<DbAuthenticationUseCaseResult>
{
  async auth(
    _authModel: AuthModel
  ): Promise<
    Either<string, RepositoryError | HasherError | TokenEncrypterError>
  > {
    return success('')
  }
}
