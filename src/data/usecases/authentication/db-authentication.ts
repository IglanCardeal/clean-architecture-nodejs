import { InvalidCredentialsError } from '@src/domain/errors'
import {
  AuthenticationUseCase,
  AuthModel
} from '@src/domain/usecases/authentication'
import { Either, failure, success } from '@src/shared'
import {
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  AccountModel,
  UpdateAccessTokenRepository
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
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authModel: AuthModel): Promise<DbAuthenticationUseCaseResult> {
    const { email, password } = authModel
    const accountFinded = await this.loadAccountByEmail(email)

    if (accountFinded.isFailure()) return failure(accountFinded.error)
    if (!accountFinded.data) return failure(new InvalidCredentialsError())

    const { password: hashedPassword, id: userId } = accountFinded.data
    const passwordCheckResult = await this.checkAccountPassword(
      password,
      hashedPassword
    )

    if (passwordCheckResult.isFailure())
      return failure(passwordCheckResult.error)
    if (!passwordCheckResult.data) return failure(new InvalidCredentialsError())

    const accessTokenResult = await this.generateAccessToken(
      accountFinded.data.id
    )

    if (accessTokenResult.isFailure()) return failure(accessTokenResult.error)

    const { data: accessToken } = accessTokenResult

    await this.updateAccessTokenRepository.update(userId, accessToken)

    return success(accessToken)
  }

  private async loadAccountByEmail(
    email: string
  ): Promise<
    Either<AccountModel | undefined, LoadAccountByEmailRepositoryError>
  > {
    try {
      const data = await this.loadAccountByEmailRepository.load(email)
      return success(data)
    } catch (error: any) {
      return failure(new LoadAccountByEmailRepositoryError(error.stack))
    }
  }

  private async checkAccountPassword(
    password: string,
    hash: string
  ): Promise<Either<boolean, HasherComparerError>> {
    try {
      const result = await this.hashComparer.compare(password, hash)
      return success(result)
    } catch (error: any) {
      return failure(new HasherComparerError(error.stack))
    }
  }

  private async generateAccessToken(
    accountId: string
  ): Promise<Either<string, TokenGeneratorError>> {
    try {
      const token = await this.tokenGenerator.generate(accountId)
      return success(token)
    } catch (error: any) {
      return failure(new TokenGeneratorError(error.stack))
    }
  }
}
