import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash')
  }
}))

const salt = 12
const makeSut = () => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  it('Shoud call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Shoud return a hash on success', async () => {
    const sut = makeSut()
    const result = await sut.hash('any_value')
    expect(result).toBe('hash')
  })
})
