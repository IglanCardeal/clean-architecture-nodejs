import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect()
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })

  it('Should not throw when already disconnect', async () => {
    await sut.disconnect()
    await expect(sut.disconnect()).resolves.toBeUndefined()
  })
})
