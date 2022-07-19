import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './db-add-account-protocols'
import { HasherError } from './db-add-account-result'
import { DbAddAccountUseCase } from './db-add-account'
class HasherStub implements Hasher {
  async hash(_password: string): Promise<string> {
    return 'hashed_password'
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add(_account: AddAccountModel): Promise<AccountModel> {
    const fakeAccount = {
      id: 'any_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    return fakeAccount
  }
}

const hasherStub = new HasherStub()
const addAccountRepositoryStub = new AddAccountRepositoryStub()

const makeSut = () => {
  return new DbAddAccountUseCase(hasherStub, addAccountRepositoryStub)
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

  it('Should call AddAccountRepository with correct values', async () => {
    const sut = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(account)
    expect(addSpy).toHaveBeenCalledWith({
      ...account,
      password: 'hashed_password'
    })
  })
})
