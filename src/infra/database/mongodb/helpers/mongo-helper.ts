import { ENV } from '@src/main/config'
import { Collection, MongoClient } from 'mongodb'

export const mongoHelper = {
  client: {} as MongoClient,
  async connect () {
    this.client = await MongoClient.connect(ENV.MONGO_URL as string)
  },
  async disconnect () {
    await this.client.close()
  },
  async getCollection (collectionName: string): Promise<Collection> {
    if (!this.client.connect) {
      await this.connect()
    }
    return this.client.db().collection(collectionName)
  }
}
