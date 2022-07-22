import { Router } from 'express'

export default (router: Router) => {
  router.post('/signup', (req, res) => {
    res.status(201).json({ ok: true })
  })
}
