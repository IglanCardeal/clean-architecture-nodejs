import { AddAccountModel } from '@src/domain/usecases/account/add-account'
import { AccountModel } from '@src/domain/models/account'

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>
}
