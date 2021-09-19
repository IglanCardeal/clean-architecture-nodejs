import supertest from 'supertest'

import { app } from '../../express/app'

describe('Content Type Middleware', () => {
  it('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      return res.send()
    })
    await supertest(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  it('Should return default content type as json', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      return res.send()
    })
    await supertest(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
