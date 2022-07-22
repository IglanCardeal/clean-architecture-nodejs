import request from 'supertest'
import { app } from '../config/app'

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
