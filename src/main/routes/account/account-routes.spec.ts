import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { app } from '@src/main/config/app'
import request from 'supertest'

describe('Account Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accounts = await MongoHelper.getCollection('accounts')
    await accounts.deleteMany({})
  })

  describe('POST /api/signup', () => {
    it('Should return status code 201 on success', async () => {
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

  describe('POST /api/login', () => {
    it('Should return status code 200 on success', async () => {
      await request(app).post('/api/signup').send({
        name: 'Foo',
        email: 'foo@mail.com',
        password: '123foo',
        passwordConfirmation: '123foo'
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'foo@mail.com',
          password: '123foo'
        })
        .expect(200)
    })
  })
})
