import jwt from 'jsonwebtoken'

import { TokenGeneratorAdapter } from './jwt-adpter'

jest.mock('jsonwebtoken', () => ({
  sign: () => 'token'
}))

const secret = 'any_secret'
const accountId = 'any_id'
const makeSut = () => new TokenGeneratorAdapter(secret)

describe('TokenGenerator Adapter', () => {
  it('Should call jsonwebtoken sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate(accountId)
    expect(signSpy).toHaveBeenCalledWith({ accountId: 'any_id' }, 'any_secret')
  })

  it('Should call return a valid token on sign success', async () => {
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
