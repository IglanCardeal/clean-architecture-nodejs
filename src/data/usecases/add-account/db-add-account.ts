import {
  Encrypter,
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const accountModel = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return accountModel
  }
}
