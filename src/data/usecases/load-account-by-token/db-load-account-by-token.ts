import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenUseCase,
  LoadAccountByTokenUseCaseProps
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByTokenUsecase
  implements LoadAccountByTokenUseCase<AccountModel>
{
  constructor(private readonly decrypter: Decrypter) {}

  async load(props: LoadAccountByTokenUseCaseProps): Promise<AccountModel> {
    await this.decrypter.decrypt(props.accessToken)
    return {} as any
  }
}
