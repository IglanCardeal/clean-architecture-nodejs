import request from 'supertest'
import { app } from '../../config/app'

describe('CORS middleware', () => {
  it('Should enable CORS http methods and headers', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
      .expect('x-powered-by', '*')
  })
})
