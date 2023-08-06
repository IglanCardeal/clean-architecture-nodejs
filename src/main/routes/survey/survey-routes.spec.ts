import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { app } from '@src/main/config/app'
import request from 'supertest'
import { SURVEYS_ROUTE_PREFIX } from './survey-routes'
import { sign } from 'jsonwebtoken'
import { Collection, Document } from 'mongodb'
import { ENV } from '@src/main/config/env'

const getValidAccessToken = async (
  accountCollection: Collection<Document>,
  role?: string
) => {
  const res = await accountCollection.insertOne({
    name: 'Foo',
    email: 'foo@mail.com',
    password: '123foo',
    passwordConfirmation: '123foo',
    role
  })
  const id = res.insertedId
  const validToken = sign({ accountId: id }, ENV.jwtSecret)
  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken: validToken
      }
    }
  )
  return validToken
}

describe('Surveys Routes', () => {
  let accountCollection: Collection<Document>

  beforeAll(async () => {
    await MongoHelper.connect()
    accountCollection = await MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe(`POST /api/${SURVEYS_ROUTE_PREFIX}`, () => {
    it('Should return status code 403 on add survey without access token', async () => {
      await request(app)
        .post(`/api/${SURVEYS_ROUTE_PREFIX}`)
        .send({
          question: 'any_question',
          answers: [
            {
              answer: 'any_answer',
              image: 'any_image'
            }
          ]
        })
        .expect(403)
    })

    it('Should return status code 204 on add survey with valid access token', async () => {
      const validToken = await getValidAccessToken(accountCollection, 'admin')
      await request(app)
        .post(`/api/${SURVEYS_ROUTE_PREFIX}`)
        .set('x-access-token', validToken)
        .send({
          question: 'any_question',
          answers: [
            {
              answer: 'any_answer',
              image: 'any_image'
            }
          ]
        })
        .expect(204)
    })
  })

  describe(`GET /api/${SURVEYS_ROUTE_PREFIX}`, () => {
    it('Should return status code 403 on add survey without access token', async () => {
      await request(app).get(`/api/${SURVEYS_ROUTE_PREFIX}`).expect(403)
    })

    it('Should return status code 200 for a valid user access token', async () => {
      const userAccessToken = await getValidAccessToken(accountCollection)

      await request(app)
        .get(`/api/${SURVEYS_ROUTE_PREFIX}`)
        .set('x-access-token', userAccessToken)
        .expect(200)
    })

    it('Should return status code 200 for a valid admin access token', async () => {
      const adminAccessToken = await getValidAccessToken(
        accountCollection,
        'admin'
      )

      await request(app)
        .get(`/api/${SURVEYS_ROUTE_PREFIX}`)
        .set('x-access-token', adminAccessToken)
        .expect(200)
    })
  })

  describe(`PUT /api/${SURVEYS_ROUTE_PREFIX}/:surveyId/results`, () => {
    const makePath = (surveyId: string) =>
      `/api/${SURVEYS_ROUTE_PREFIX}/${surveyId}/results`

    it('Should return status code 403 on save survey result without access token', async () => {
      await request(app).put(makePath('any_id')).expect(403)
    })
  })
})
