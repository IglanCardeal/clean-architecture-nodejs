import * as dotenv from 'dotenv'

dotenv.config()

const { env } = process

export const ENV = {
  mongoUrl: env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: env.PORT || 3000,
  bcryptSalt: Number(env.BCRYPT_SALT) || 12,
  jwtSecret: env.JWT_SECRET || 'any_secret_1tJK==__02&sdA'
}
