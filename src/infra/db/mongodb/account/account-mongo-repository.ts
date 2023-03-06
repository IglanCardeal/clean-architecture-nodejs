import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@src/data/protocols/db'
import { AccountModel } from '@src/domain/models/account'
import { AddAccountModel } from '@src/domain/usecases/add-account'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection<AddAccountModel>(
      'accounts'
    )
    const document = await accountCollection.insertOne({ ...account })
    return { ...account, id: MongoHelper.mapInsertedIdToString(document) }
  }

  async loadByEmail(email: string): Promise<AccountModel | undefined> {
    const accountCollection = await MongoHelper.getCollection<AddAccountModel>(
      'accounts'
    )
    const accountFinded = await accountCollection.findOne({
      email
    })
    if (!accountFinded) return undefined
    return {
      ...accountFinded,
      id: MongoHelper.mapDocumentIdToString(accountFinded)
    }
  }

  async updateAccessToken(
    accountId: string,
    accessToken: string
  ): Promise<void> {
    const accountCollection = await MongoHelper.getCollection<AccountModel>(
      'accounts'
    )
    await accountCollection.updateOne(
      {
        _id: new ObjectId(accountId)
      },
      {
        $set: {
          accessToken
        }
      }
    )
  }

  async loadByToken(
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | undefined> {
    const accountCollection = await MongoHelper.getCollection<AddAccountModel>(
      'accounts'
    )
    const accountFinded = await accountCollection.findOne({
      accessToken: accessToken,
      $or: [
        {
          role
        },
        {
          role: 'admin'
        }
      ]
    })

    if (!accountFinded) return undefined

    return {
      ...accountFinded,
      id: MongoHelper.mapDocumentIdToString(accountFinded)
    }
  }
}
