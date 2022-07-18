import { Hasher } from '@src/data/protocols/hasher'
import {
  AddAccountUseCase,
  AddAccountModel
} from '@src/domain/usecases/add-account'
import { failure, success } from '@src/shared/either'
import { DbAddAccountResult, HasherError } from './add-account-results'

export class DbAddAccountUseCase
  implements AddAccountUseCase<DbAddAccountResult>
{
  constructor(private readonly hasher: Hasher) {}

  async add(account: AddAccountModel): Promise<DbAddAccountResult> {
    try {
      await this.hasher.hash(account.password)
    } catch (error) {
      return failure(new HasherError(error))
    }
    return success({ ...account, id: '' })
  }
}
