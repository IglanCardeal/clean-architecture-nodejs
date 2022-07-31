import { AccountModel } from '../../usecases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel | undefined>
}
