import { AddAccountParams } from '@src/domain/usecases/account/add-account'
import { AccountModel } from '@src/domain/models/account'

export interface AddAccountRepository {
  add(account: AddAccountParams): Promise<AccountModel>
}
