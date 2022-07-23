import { Collection, Document, InsertOneResult, MongoClient } from 'mongodb'

const twentyFiveSeconds = 25_000

export const MongoHelper = {
  client: {} as MongoClient,
  uri: '',

  async connect(uri = process.env.MONGO_URL) {
    this.client = await MongoClient.connect(uri as string, {
      connectTimeoutMS: twentyFiveSeconds
    })
    this.uri = uri as string
  },

  async disconnect() {
    await this.client?.close()
    this.client = null as any
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  mapInsertedIdToString: ({
    insertedId
  }: InsertOneResult<Document>): string => {
    return insertedId.toString()
  }
}
