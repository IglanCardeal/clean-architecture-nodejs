import { Hasher } from '@src/data/protocols/hasher'
import {
  AddAccountUseCase,
  AddAccountModel
} from '@src/domain/usecases/add-account'
import { success } from '@src/shared/either'
import { DbAddAccountResult } from './add-account-results'

export class DbAddAccountUseCase
  implements AddAccountUseCase<DbAddAccountResult>
{
  constructor(private readonly hasher: Hasher) {}

  async add(account: AddAccountModel): Promise<DbAddAccountResult> {
    await this.hasher.hash(account.password)
    return success({ ...account, id: '' })
  }
}
