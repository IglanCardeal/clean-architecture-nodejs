import { AddAccountRepository } from '@src/modules/account/usecases/signup/ports/add-account-repository'
import { AccountModel } from '@src/domain/models/account'
import { AddAccountModel } from '@src/domain/usecases/add-account'
import { mongoHelper } from '../helpers/mongo-helper'

export class AccountRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne({ ...accountData })
    return { ...accountData, id: result.insertedId.toHexString() }
  }
}
