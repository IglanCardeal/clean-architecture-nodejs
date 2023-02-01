import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '@src/presentation/helpers/http'
import { AccessDeniedError } from '../errors'

const makeSut = () => {
  return new AuthMiddleware()
}

describe('Auth Middleware', () => {
  const sut = makeSut()

  it('should return 403 if no x-access-token is provided', async () => {
    const result = await sut.handle({})
    expect(result).toEqual(forbidden(new AccessDeniedError()))
  })
})
