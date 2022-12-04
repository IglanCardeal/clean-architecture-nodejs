import {
  LogDataError,
  LogTransactionId,
  LogRepository
} from '@src/data/protocols/db'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogRepository {
  async logError<T extends LogDataError>(data: T): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      ...data,
      date: new Date()
    })
  }

  async logInfo<T extends LogTransactionId>(data: T): Promise<void> {
    const infoCollection = await MongoHelper.getCollection('infos')
    await infoCollection.insertOne({
      ...data,
      date: new Date()
    })
  }
}
