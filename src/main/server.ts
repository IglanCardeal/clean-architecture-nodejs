/* eslint-disable no-console */
import express from 'express'

const app = express()

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
