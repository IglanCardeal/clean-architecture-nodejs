import * as dotenv from 'dotenv'

dotenv.config()

const { env } = process

export const ENV = {
  mongoUrl: env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: env.PORT || 3000,
  bcryptSalt: Number(env.SALT) || 12,
  tokenSecret: 'any_secret'
}
