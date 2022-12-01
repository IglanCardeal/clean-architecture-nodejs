import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = () => new AccountMongoRepository()

describe('Account MongoDB Repository', () => {
  const insertFakeAccount = async ({ name, email, password }: any) => {
    const accounts = await MongoHelper.getCollection('accounts')
    await accounts.insertOne({
      name,
      email,
      password
    })
  }

  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accounts = await MongoHelper.getCollection('accounts')
    await accounts.deleteMany({})
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
})
