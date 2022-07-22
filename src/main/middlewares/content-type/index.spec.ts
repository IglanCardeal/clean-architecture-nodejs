import request from 'supertest'
import { app } from '../../config/app'

describe('Content Type JSON middleware', () => {
  it('', async () => {
    app.get('/test_content_type_json', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content_type_json')
      .expect('Content-Type', /json/)
  })
})
