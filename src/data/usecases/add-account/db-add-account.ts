import {
  Encrypter,
  AccountModel,
  AddAccount,
  AddAccountModel
} from './db-add-account-protocols'

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
