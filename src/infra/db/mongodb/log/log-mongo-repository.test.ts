import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers'
import { LogMongoRepository } from './log-mongo-repository'

describe('Log Mongo Repository', () => {
  let errorsCollection: Collection
  let infosCollection: Collection
  const sut = new LogMongoRepository()

  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorsCollection = await MongoHelper.getCollection('errors')
    infosCollection = await MongoHelper.getCollection('infos')
    await errorsCollection.deleteMany({})
    await infosCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    await sut.logError({ stack: 'any_stack', transactionId: 'any_id' })
    const count = await errorsCollection.countDocuments()
    expect(count).toBe(1)
  })

  it('Should create an info log on success', async () => {
    await sut.logInfo({ body: 'any_body', transactionId: 'any_id' })
    const count = await infosCollection.countDocuments()
    expect(count).toBe(1)
  })
})
