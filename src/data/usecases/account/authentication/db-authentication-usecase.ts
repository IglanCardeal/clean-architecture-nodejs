import { InvalidCredentialsError } from '@src/domain/errors'
import { Either, failure, success } from '@src/shared'
import {
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator,
  AccountModel,
  UpdateAccessTokenRepository,
  AuthenticationUseCase,
  AuthParams
} from './db-authentication-usecase-protocols'
import {
  DbAuthenticationUseCaseResult,
  HasherComparerError,
  LoadAccountByEmailRepositoryError,
  TokenGeneratorError,
  UpdateAccessTokenRepositoryError,
  UserAccessToken
} from './db-authentication-usecase-result'

export class DbAuthenticationUseCase
  implements AuthenticationUseCase<DbAuthenticationUseCaseResult>
{
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authModel: AuthParams): Promise<DbAuthenticationUseCaseResult> {
    const { email, password: passwordInformed } = authModel
    const loadAccountByEmailResult = await this.loadAccountByEmail(email)

    if (loadAccountByEmailResult.isFailure())
      return failure(loadAccountByEmailResult.error)

    if (!loadAccountByEmailResult.data)
      return failure(new InvalidCredentialsError())

    const { password: hashedAccountPassword, id: accountId } =
      loadAccountByEmailResult.data
    const isAccountPasswordCorrectResult = await this.isAccountPasswordCorrect({
      passwordInformed,
      hashedAccountPassword
    })

    if (isAccountPasswordCorrectResult.isFailure())
      return failure(isAccountPasswordCorrectResult.error)

    if (!isAccountPasswordCorrectResult.data)
      return failure(new InvalidCredentialsError())

    const generateAccessTokenByAccountIdResult =
      await this.generateAccessTokenByAccountId(accountId)

    if (generateAccessTokenByAccountIdResult.isFailure())
      return failure(generateAccessTokenByAccountIdResult.error)

    const { data: accountAccessToken } = generateAccessTokenByAccountIdResult

    const updateAccountgenerateAccessTokenByAccountIdResult =
      await this.updateAccountAccessToken({
        accountId,
        accessToken: accountAccessToken
      })

    if (updateAccountgenerateAccessTokenByAccountIdResult.isFailure())
      return failure(updateAccountgenerateAccessTokenByAccountIdResult.error)

    return success(new UserAccessToken(accountAccessToken))
  }

  private async updateAccountAccessToken({
    accessToken,
    accountId
  }: {
    accountId: string
    accessToken: string
  }): Promise<Either<void, UpdateAccessTokenRepositoryError>> {
    try {
      await this.updateAccessTokenRepository.updateAccessToken(
        accountId,
        accessToken
      )
      return success(undefined)
    } catch (error: any) {
      return failure(new UpdateAccessTokenRepositoryError(error.stack))
    }
  }

  private async loadAccountByEmail(
    email: string
  ): Promise<
    Either<AccountModel | undefined, LoadAccountByEmailRepositoryError>
  > {
    try {
      const data = await this.loadAccountByEmailRepository.loadByEmail(email)
      return success(data)
    } catch (error: any) {
      return failure(new LoadAccountByEmailRepositoryError(error.stack))
    }
  }

  private async isAccountPasswordCorrect({
    passwordInformed,
    hashedAccountPassword
  }: {
    passwordInformed: string
    hashedAccountPassword: string
  }): Promise<Either<boolean, HasherComparerError>> {
    try {
      const result = await this.hashComparer.compare(
        passwordInformed,
        hashedAccountPassword
      )
      return success(result)
    } catch (error: any) {
      return failure(new HasherComparerError(error.stack))
    }
  }

  private async generateAccessTokenByAccountId(
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
