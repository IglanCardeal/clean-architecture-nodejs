import { AddAccountRepository } from '@src/data/protocols/add-account-repository'
import { AccountModel } from '@src/domain/models/account'
import { AddAccountModel } from '@src/domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const document = await accountCollection.insertOne({ ...account })
    return { ...account, id: MongoHelper.mapInsertedIdToString(document) }
  }
}
