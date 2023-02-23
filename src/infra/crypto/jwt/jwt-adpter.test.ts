import jwt from 'jsonwebtoken'

import { TokenGeneratorAdapter } from './jwt-adpter'

jest.mock('jsonwebtoken', () => ({
  sign: () => 'token',
  verify: () => ({ accountId: 'account_id' })
}))

const secret = 'any_secret'
const makeSut = () => new TokenGeneratorAdapter(secret)

describe('JWT TokenGenerator Adapter', () => {
  const accountId = 'any_id'
  const accessToken = 'any_token'

  describe('sign()', () => {
    it('Should call jsonwebtoken sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.generate(accountId)
      expect(signSpy).toHaveBeenCalledWith(
        { accountId: 'any_id' },
        'any_secret'
      )
    })

    it('Should return a valid token on sign success', async () => {
      const sut = makeSut()
      const result = await sut.generate(accountId)
      expect(result).toBe('token')
    })

    it('Should throw if jsonwebtoken sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      await expect(sut.generate(accountId)).rejects.toThrow()
    })
  })

  describe('decrypt()', () => {
    it('Should call jsonwebtoken verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt(accessToken)
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'any_secret')
    })

    it('Should return a valid account id on decrypt success', async () => {
      const sut = makeSut()
      const result = await sut.decrypt(accessToken)
      expect(result).toBe('account_id')
    })

    it('Should throw if jsonwebtoken verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      await expect(sut.decrypt(accessToken)).rejects.toThrow()
    })
  })
})
