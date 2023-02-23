import { InvalidAccountTokenOrRoleError } from '@src/domain/errors'
import { Either, failure, success } from '@src/shared'
import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
  LoadAccountByTokenUseCase,
  LoadAccountByTokenUseCaseProps
} from './db-load-account-by-token-protocols'
import {
  DbLoadAccountByTokenUsecaseResult,
  DecrypterError,
  LoadAccountByTokenRepositoryError
} from './db-load-account-by-token-result'

export class DbLoadAccountByTokenUsecase
  implements LoadAccountByTokenUseCase<DbLoadAccountByTokenUsecaseResult>
{
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load({
    accessToken,
    role
  }: LoadAccountByTokenUseCaseProps): Promise<DbLoadAccountByTokenUsecaseResult> {
    const decryptResult = await this.decryptAccessTokenAndReturnAccountId(
      accessToken
    )

    if (decryptResult.isFailure()) {
      return failure(decryptResult.error)
    }

    const accountId = decryptResult.data
    const findAccountResult = await this.findAccountById(accountId, role)

    if (findAccountResult.isFailure()) {
      return failure(findAccountResult.error)
    }

    const account = findAccountResult.data

    if (!account) {
      return failure(new InvalidAccountTokenOrRoleError())
    }

    return success(account)
  }

  private async decryptAccessTokenAndReturnAccountId(
    accessToken: string
  ): Promise<Either<string, DecrypterError>> {
    try {
      const accountId = await this.decrypter.decrypt(accessToken)
      return success(accountId)
    } catch (error: any) {
      return failure(new DecrypterError(error.stack))
    }
  }

  private async findAccountById(
    accountId: string,
    role?: string
  ): Promise<
    Either<AccountModel | undefined, LoadAccountByTokenRepositoryError>
  > {
    try {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accountId,
        role
      )
      return success(account)
    } catch (error: any) {
      return failure(new LoadAccountByTokenRepositoryError(error.stack))
    }
  }
}
