import { Hasher, DbAddAccountUseCase } from './db-add-account-protocols'
import { HasherError } from './add-account-results'

class HasherStub implements Hasher {
  async hash(_password: string): Promise<string> {
    return 'hashed_password'
  }
}

const hasherStub = new HasherStub()

const makeSut = () => {
  return new DbAddAccountUseCase(hasherStub)
}

describe('DbAddAccountUseCase', () => {
  const account = {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }

  it('Should call Hasher with correct password', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(account)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should return HasherError if Hasher throws', async () => {
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      throw new Error('Hasher error')
    })
    const sut = makeSut()
    const result = await sut.add(account)
    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.error).toEqual(new HasherError(new Error('Hasher error')))
    }
  })
})
