import supertest from 'supertest'

import { app } from '../../express/app'

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_parser', (req, res) => {
      return res.send(req.body)
    })
    await supertest(app)
      .post('/test_parser')
      .send({ name: 'test' })
      .expect({ name: 'test' })
  })
})
