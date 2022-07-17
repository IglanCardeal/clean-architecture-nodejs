import { Hasher } from '@src/data/protocols/hasher'
import { DbAddAccountUseCase } from './db-add-account'

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
})
