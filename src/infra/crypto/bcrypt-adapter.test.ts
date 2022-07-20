import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = () => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  it('Shoud call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
