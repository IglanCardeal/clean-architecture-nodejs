import bcrypt from 'bcrypt'

import { Encrypter } from '@src/data/protocols/encrypter'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async () => 'hashed password'
}))

const SALT = 12

const makeSut = (): Encrypter => new BcryptAdapter(SALT)

describe('Bcrypt Adapter Infra', () => {
  it('Shoud call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  it('Shoud returns hashed password for a correct value', async () => {
    const sut = makeSut()
    const hashedPassword = await sut.encrypt('any_values')
    expect(hashedPassword).toBe('hashed password')
  })
})
