import { Router } from 'express'

export default (router: Router) => {
  router.post('/signup', (req, res) => {
    res.send({ ok: true })
  })
}
