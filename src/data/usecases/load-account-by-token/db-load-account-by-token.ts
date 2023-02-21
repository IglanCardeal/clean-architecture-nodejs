import { failure } from '@src/shared'
import {
  Decrypter,
  LoadAccountByTokenUseCase,
  LoadAccountByTokenUseCaseProps
} from './db-load-account-by-token-protocols'
import {
  DbLoadAccountByTokenUsecaseResult,
  DecrypterError
} from './db-load-account-by-token-result'

export class DbLoadAccountByTokenUsecase
  implements LoadAccountByTokenUseCase<DbLoadAccountByTokenUsecaseResult>
{
  constructor(private readonly decrypter: Decrypter) {}

  async load(
    props: LoadAccountByTokenUseCaseProps
  ): Promise<DbLoadAccountByTokenUsecaseResult> {
    try {
      await this.decrypter.decrypt(props.accessToken)
    } catch (error: any) {
      return failure(new DecrypterError(error.stack))
    }
    return {} as any
  }
}
