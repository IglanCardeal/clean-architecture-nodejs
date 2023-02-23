import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash')
  },
  async compare(): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const salt = 12
const makeSut = () => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  const sut = makeSut()

  describe('hash()', () => {
    it('Shoud call bcrypt hash with correct values', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('Shoud return a valid hash on success', async () => {
      const result = await sut.hash('any_value')
      expect(result).toBe('hash')
    })

    it('Shoud throw if bcrypt hash throws', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
        throw new Error()
      })
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    it('Shoud return true if password match', async () => {
      const result = await sut.compare('any_password', 'any_hash')
      expect(result).toBe(true)
    })

    it('Shoud return false if password does not match', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
        return Promise.resolve(false)
      })
      const result = await sut.compare('wrong_password', 'any_hash')
      expect(result).toBe(false)
    })

    it('Shoud call bcrypt compare with correct values', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_password', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_hash')
    })

    it('Shoud throw if bcrypt compare throws', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
        throw new Error()
      })
      const promise = sut.compare('any_password', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
