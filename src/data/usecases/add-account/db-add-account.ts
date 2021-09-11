import { Encrypter } from '@src/data/protocols/encrypter'
import { AccountModel } from '@src/domain/models/account'
import { AddAccount, AddAccountModel } from '@src/domain/usecases/add-account'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return {
      email: '',
      id: '',
      name: '',
      password: ''
    }
  }
}
