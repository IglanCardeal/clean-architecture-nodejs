import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { app } from '@src/main/config/app'
import request from 'supertest'
import { SURVEYS_ROUTE_PREFIX } from './survey-routes'

describe('Surveys Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe(`POST /api/${SURVEYS_ROUTE_PREFIX}`, () => {
    it('Should return status code 204 on success', async () => {
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
        .expect(204)
    })
  })
})
