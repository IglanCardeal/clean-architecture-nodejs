import { app } from '@src/main/config/app'
import request from 'supertest'

describe('SignUp Routes', () => {
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
