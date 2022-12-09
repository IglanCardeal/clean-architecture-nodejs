import { AccountModel } from '@src/domain/models/account'

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel | undefined>
}
