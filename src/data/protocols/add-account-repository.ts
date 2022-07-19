import { AddAccountModel } from '@src/domain/usecases/add-account'
import { AccountModel } from '@src/domain/models/account'

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>
}
