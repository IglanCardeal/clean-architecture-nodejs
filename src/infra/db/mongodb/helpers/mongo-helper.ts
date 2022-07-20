import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: {} as MongoClient,

  async connect(uri = process.env.MONGO_URL) {
    this.client = await MongoClient.connect(uri as string)
  },

  async disconnect() {
    await this.client.close()
  }
}