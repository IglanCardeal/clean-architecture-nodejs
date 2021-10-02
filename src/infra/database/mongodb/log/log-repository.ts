import { LogErrorRepository } from '@src/shared/ports/log-repository'
import { mongoHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const errorsCollection = await mongoHelper.getCollection('errors')
    await errorsCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
