export const ENV = Object.freeze({
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api'
})
