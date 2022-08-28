import {
  LogDataError,
  LogDataRequest,
  LogDataResponse,
  LogRepository
} from '@src/presentation/protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements LogRepository {
  async logError(data: LogDataError): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      ...data,
      date: new Date()
    })
  }

  async logInfo(data: LogDataRequest | LogDataResponse): Promise<void> {
    const infoCollection = await MongoHelper.getCollection('infos')
    await infoCollection.insertOne({
      ...data,
      date: new Date()
    })
  }
}
