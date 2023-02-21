import { AccountModel } from '@src/domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken(
    accountId: string,
    role?: string
  ): Promise<AccountModel | undefined>
}
