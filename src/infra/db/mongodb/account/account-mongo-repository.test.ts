import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = () => new AccountMongoRepository()
const makeFakeAccountData = () => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

describe('Account MongoDB Repository', () => {
  const sut = makeSut()
  let accountCollection: Collection<Document>

  const insertFakeAccount = async ({ name, email, password }: any) => {
    return accountCollection.insertOne({
      name,
      email,
      password
    })
  }

  beforeAll(async () => {
    await MongoHelper.connect()
    accountCollection = await MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await accountCollection.deleteMany({})
  })

  it('Should return an account on add success', async () => {
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...makeFakeAccountData()
      })
    )
  })

  it('Should return an account on loadByEmail success', async () => {
    await insertFakeAccount(makeFakeAccountData())
    const account = await sut.loadByEmail('valid_email@mail.com')
    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...makeFakeAccountData()
      })
    )
  })

  it('Should return undefined if loadByEmail fails', async () => {
    const account = await sut.loadByEmail('valid_email2@mail.com')
    expect(account).toBeUndefined()
  })

  it('Should update account access token on updateAccessToken success', async () => {
    const { insertedId: fakeAccountId } = await insertFakeAccount(
      makeFakeAccountData()
    )
    const accountBefore = await accountCollection.findOne({
      _id: fakeAccountId
    })
    expect(accountBefore?.accessToken).toBeUndefined()
    await sut.updateAccessToken(fakeAccountId.toString(), 'any_token')
    const accountAfter = await accountCollection.findOne({
      _id: fakeAccountId
    })
    expect(accountAfter?.accessToken).toBe('any_token')
  })
})
