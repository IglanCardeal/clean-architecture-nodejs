import { mongoHelper } from '@src/infra/database/mongodb/helpers/mongo-helper'
import supertest from 'supertest'
import { app } from '../express/app'

describe('SignUp Route', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  beforeEach(async () => {
    ;(await mongoHelper.getCollection('accounts')).deleteMany({})
  })

  it('Should return default content type as json', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({
        name: 'Any Name',
        email: 'any@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})
