import { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { LogErrorMongoRepository } from './log-repository'

describe('Log Mongodb Repository', () => {
  let errorsCollection: Collection

  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorsCollection = await mongoHelper.getCollection('errors')
    await errorsCollection.deleteMany({})
  })

  it('Should create an error log with success', async () => {
    const sut = new LogErrorMongoRepository()
    await sut.log('any error')
    const count = await errorsCollection.countDocuments()
    expect(count).toBe(1)
  })
})
