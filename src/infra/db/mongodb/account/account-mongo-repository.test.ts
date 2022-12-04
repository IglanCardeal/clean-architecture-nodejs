import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = () => new AccountMongoRepository()

describe('Account MongoDB Repository', () => {
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
    const sut = makeSut()
    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    expect(account)
    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
    )
  })

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await insertFakeAccount({
      name: 'valid_name2',
      email: 'valid_email2@mail.com',
      password: 'hashed_password2'
    })
    const account = await sut.loadByEmail('valid_email2@mail.com')
    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'valid_name2',
        email: 'valid_email2@mail.com',
        password: 'hashed_password2'
      })
    )
  })

  it('Should return undefined if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('valid_email2@mail.com')
    expect(account).toBeUndefined()
  })

  it('Should update account access token on updateAccessToken success', async () => {
    const { insertedId: fakeAccountId } = await insertFakeAccount({
      name: 'valid_name3',
      email: 'valid_email3@mail.com',
      password: 'hashed_password3'
    })
    const accountBefore = await accountCollection.findOne({
      _id: fakeAccountId
    })
    expect(accountBefore).toBeTruthy()
    expect(accountBefore?.accessToken).toBeUndefined()
    const sut = makeSut()
    await sut.updateAccessToken(fakeAccountId.toString(), 'any_token')
    const accountAfter = await accountCollection.findOne({
      _id: fakeAccountId
    })
    expect(accountAfter).toBeTruthy()
    expect(accountAfter?.accessToken).toBe('any_token')
  })
})
