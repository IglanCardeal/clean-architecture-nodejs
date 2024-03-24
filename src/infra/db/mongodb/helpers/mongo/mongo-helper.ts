import {
  Collection,
  Document,
  InsertOneResult,
  MongoClient,
  WithId
} from 'mongodb'

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

  async getCollection<T extends Document>(
    name: string
  ): Promise<Collection<T>> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection<T>(name)
  },

  mapInsertedIdToString: ({
    insertedId
  }: InsertOneResult<Document>): string => {
    return insertedId.toString()
  },

  mapDocumentIdToString: ({ _id }: WithId<Document>): string => {
    return _id.toString()
  }
}
