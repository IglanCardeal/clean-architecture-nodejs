import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@src/data/protocols/db'
import { AccountModel } from '@src/domain/models/account'
import { AddAccountParams } from '@src/domain/usecases/account/add-account'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '@src/infra/db/mongodb/helpers'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(account: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await this.getAccountCollection()
    const document = await accountCollection.insertOne({ ...account })
    return { ...account, id: MongoHelper.mapInsertedIdToString(document) }
  }

  async loadByEmail(email: string): Promise<AccountModel | undefined> {
    const accountCollection = await this.getAccountCollection()
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
    const accountCollection = await this.getAccountCollection<AccountModel>()
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
    const accountCollection = await this.getAccountCollection()
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

  private async getAccountCollection<T extends AddAccountParams>() {
    return await MongoHelper.getCollection<T>('accounts')
  }
}
