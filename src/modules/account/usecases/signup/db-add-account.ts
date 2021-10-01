import { AddAccountRepository } from '@src/modules/account/usecases/signup/ports/add-account-repository'
import { Encrypter } from '@src/modules/account/usecases/signup/ports/encrypter'
import { AccountModel } from '@src/domain/models/account'
import { AddAccount, AddAccountModel } from '@src/domain/usecases/add-account'

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
