import { AccountModel } from '../../usecases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel | undefined>
}
