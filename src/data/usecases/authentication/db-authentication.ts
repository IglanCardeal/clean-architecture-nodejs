import { InvalidCredentialsError } from '@src/domain/errors'
import {
  AuthenticationUseCase,
  AuthModel
} from '@src/domain/usecases/authentication'
import { failure, success } from '@src/shared'
import {
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator
} from './db-authentication-protocols'
import {
  DbAuthenticationUseCaseResult,
  HasherComparerError,
  LoadAccountByEmailRepositoryError,
  TokenGeneratorError
} from './db-authentication-result'

export class DbAuthenticationUseCase
  implements AuthenticationUseCase<DbAuthenticationUseCaseResult>
{
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth(authModel: AuthModel): Promise<DbAuthenticationUseCaseResult> {
    const { email, password } = authModel
    let account

    try {
      account = await this.loadAccountByEmailRepository.load(email)
    } catch (error: any) {
      return failure(new LoadAccountByEmailRepositoryError(error.stack))
    }

    if (!account) {
      return failure(new InvalidCredentialsError())
    }

    let passwordCorrect: boolean

    try {
      passwordCorrect = await this.hashComparer.compare(
        password,
        account.password
      )
    } catch (error: any) {
      return failure(new HasherComparerError(error.stack))
    }

    if (!passwordCorrect) {
      return failure(new InvalidCredentialsError())
    }

    try {
      await this.tokenGenerator.generate(account.id)
    } catch (error: any) {
      return failure(new TokenGeneratorError(error.stack))
    }

    return success('')
  }
}
