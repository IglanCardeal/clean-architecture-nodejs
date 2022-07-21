import express, { Express } from 'express'

export const bodyParser = (app: Express) => {
  app.use(express.json())
}
