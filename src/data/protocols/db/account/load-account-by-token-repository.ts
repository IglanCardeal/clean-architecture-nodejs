import { AccountModel } from '@src/domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken(
    accessToken: string,
    role?: string
  ): Promise<AccountModel | undefined>
}
