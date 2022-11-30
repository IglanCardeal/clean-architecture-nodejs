import jwt from 'jsonwebtoken'

import { TokenGeneratorAdapter } from './jwt-adpter'

jest.mock('jsonwebtoken', () => ({
  sign: () => 'token'
}))

const secret = 'any_secret'
const accountId = 'any_id'
const makeSut = () => new TokenGeneratorAdapter(secret)

describe('TokenGenerator Adapter', () => {
  it('Should call jsonwebtoken sign with correct values', () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.generate(accountId)
    expect(signSpy).toHaveBeenCalledWith({ accountId: 'any_id' }, 'any_secret')
  })
})
