import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = () => new AccountMongoRepository()

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
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
})
