import { MongoClient } from 'mongodb'

export const mongoHelper = {
  client: {} as MongoClient,
  async connect () {
    this.client = await MongoClient.connect(process.env.MONGO_URL as string)
  },
  async disconnect () {
    await this.client.close()
  }
}
