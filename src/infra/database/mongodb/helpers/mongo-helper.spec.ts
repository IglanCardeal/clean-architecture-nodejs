import { mongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect()
  })
  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect when MongoDB connection is down', async () => {
    let account = await sut.getCollection('accounts')
    let fakeUser = await account.insertOne({ name: 'fake name' })
    expect(fakeUser).toBeTruthy()
    account = await sut.getCollection('accounts')
    fakeUser = await account.insertOne({ name: 'fake name' })
    expect(fakeUser).toBeTruthy()
  })
})
