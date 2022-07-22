import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { app } from '@src/main/config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accounts = MongoHelper.getCollection('accounts')
    await accounts.deleteMany({})
  })

  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Foo',
        email: 'foo@mail.com',
        password: '123foo',
        passwordConfirmation: '123foo'
      })
      .expect(201)
  })
})
