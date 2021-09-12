import { mongoHelper } from '../helpers/mongo-helper'
import { AccountRepository } from './account-repository'

describe('Account Mongodb Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  it('Should return account on success', async () => {
    const sut = new AccountRepository()
    const account = await sut.add({
      name: 'any name',
      email: 'any@email.com',
      password: 'any password'
    })
    expect(account).toBeTruthy()
    expect(account).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'any name',
        email: 'any@email.com',
        password: 'any password'
      })
    )
  })
})
