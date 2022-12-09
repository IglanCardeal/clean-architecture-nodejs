import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { app } from '@src/main/config/app'
import request from 'supertest'
import { ACCOUNT_ROUTE_PREFIX } from './account-routes'

describe('Account Routes', () => {
  const createFakeAccount = async (data: any) => {
    await request(app).post(`/api/${ACCOUNT_ROUTE_PREFIX}/signup`).send(data)
  }

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
      await createFakeAccount({
        name: 'Foo2',
        email: 'foo2@mail.com',
        password: '567foo',
        passwordConfirmation: '567foo'
      })
      const response = await request(app)
        .post(`/api/${ACCOUNT_ROUTE_PREFIX}/login`)
        .send({
          email: 'foo2@mail.com',
          password: '567foo'
        })
        .expect(200)
      expect(response.body).toEqual({
        accessToken: expect.any(String)
      })
    })

    it('Should return status code 401 if password is incorrect', async () => {
      await createFakeAccount({
        name: 'Foo2',
        email: 'foo2@mail.com',
        password: '567foo',
        passwordConfirmation: '567foo'
      })
      await request(app)
        .post(`/api/${ACCOUNT_ROUTE_PREFIX}/login`)
        .send({
          email: 'foo2@mail.com',
          password: 'invalid_pass'
        })
        .expect(401)
    })

    it('Should return status code 401 if email not found', async () => {
      await request(app)
        .post(`/api/${ACCOUNT_ROUTE_PREFIX}/login`)
        .send({
          email: 'notfound@mail.com',
          password: 'foo'
        })
        .expect(401)
    })

    it('Should return status code 400 if email is invalid', async () => {
      await request(app)
        .post(`/api/${ACCOUNT_ROUTE_PREFIX}/login`)
        .send({
          email: 'invalidmail.com',
          password: 'foo'
        })
        .expect(400)
    })
  })
})
