import request from 'supertest'
import { app } from '../../config/app'
import { noCache } from '.'

describe('No Cache middleware', () => {
  it('Should disable cache', async () => {
    app.get('/test_no_cache', noCache, (req: any, res: any) => {
      res.send()
    })
    await request(app)
      .get('/test_no_cache')
      .expect(
        'cache-control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      )
      .expect('expires', '0')
      .expect('ssurrogate-control', 'no-store')
  })
})
