import supertest from 'supertest'
import { app } from '../express/app'

describe('SignUp Route', () => {
  it('Should return default content type as json', async () => {
    app.post('/api/signup', (req, res) => {
      return res.send({ ok: true })
    })
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
