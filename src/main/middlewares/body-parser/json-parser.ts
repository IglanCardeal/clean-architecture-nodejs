import express, { Express } from 'express'

export const jsonParser = (app: Express) => {
  app.use(express.json())
}
