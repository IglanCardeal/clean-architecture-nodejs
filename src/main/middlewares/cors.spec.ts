import supertest from 'supertest'

import { app } from '../express/app'

describe('CORS Middleware', () => {
  it('Should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      return res.send()
    })
    await supertest(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
