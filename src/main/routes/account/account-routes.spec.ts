import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { app } from '@src/main/config/app'
import request from 'supertest'
import { ACCOUNT_ROUTE_PREFIX } from './account-routes'

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

  describe(`POST /api/${ACCOUNT_ROUTE_PREFIX}/signup`, () => {
    it('Should return status code 201 on success', async () => {
      await request(app)
        .post(`/api/${ACCOUNT_ROUTE_PREFIX}/signup`)
        .send({
          name: 'Foo',
          email: 'foo@mail.com',
          password: '123foo',
          passwordConfirmation: '123foo'
        })
        .expect(201)
    })
  })

  describe(`POST /api/${ACCOUNT_ROUTE_PREFIX}/login`, () => {
    it('Should return status code 200 on success', async () => {
      await request(app).post(`/api/${ACCOUNT_ROUTE_PREFIX}/signup`).send({
        name: 'Foo2',
        email: 'foo2@mail.com',
        password: '567foo',
        passwordConfirmation: '567foo'
      })
      await request(app)
        .post(`/api/${ACCOUNT_ROUTE_PREFIX}/login`)
        .send({
          email: 'foo2@mail.com',
          password: '567foo'
        })
        .expect(200)
    })
  })
})
