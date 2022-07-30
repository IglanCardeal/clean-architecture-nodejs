import { AuthenticationUseCase, AuthModel } from '@src/domain/usecases/authentication'
import { Either, success } from '@src/shared'
import { LoadAccountByEmailRepository } from './db-authentication-protocols'
import { DbAuthenticationUseCaseResult, HasherError, RepositoryError, TokenEncrypterError } from './db-authentication-result'

export class DbAuthenticationUseCase implements AuthenticationUseCase<DbAuthenticationUseCaseResult> {
  constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async auth(authModel: AuthModel): Promise<Either<string, RepositoryError | HasherError | TokenEncrypterError>> {
    await this.loadAccountByEmailRepository.load(authModel.email)
    return success('')
  }
}
