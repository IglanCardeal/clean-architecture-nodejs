import { failure } from '@src/shared'
import {
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

  async load(
    props: LoadAccountByTokenUseCaseProps
  ): Promise<DbLoadAccountByTokenUsecaseResult> {
    let accountId: string

    try {
      accountId = await this.decrypter.decrypt(props.accessToken)
    } catch (error: any) {
      return failure(new DecrypterError(error.stack))
    }

    try {
      await this.loadAccountByTokenRepository.loadByToken(accountId, props.role)
    } catch (error: any) {
      return failure(new LoadAccountByTokenRepositoryError(error.stack))
    }

    return {} as any
  }
}
