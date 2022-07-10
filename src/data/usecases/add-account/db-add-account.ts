import { Encrypter } from '@src/data/protocols/encrypter'
import {
  AddAccountUseCase,
  AddAccountModel
} from '@src/domain/usecases/add-account'
import { success } from '@src/shared/either'
import { DbAddAccountResult } from './add-account-results'

export class DbAddAccount implements AddAccountUseCase<DbAddAccountResult> {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<DbAddAccountResult> {
    await this.encrypter.encrypt(account.password)
    return success({ ...account, id: '' })
  }
}
