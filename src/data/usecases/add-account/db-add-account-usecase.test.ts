import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './db-add-account-usecase-protocols'
import {
  HasherError,
  AddAccountRepositoryError,
  LoadAccountByEmailRepositoryError
} from './db-add-account-usecase-result'
import { DbAddAccountUseCase } from './db-add-account-usecase'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-usecase-protocols'
import { EmailAlreadyInUseError } from '@src/domain/errors'
class HasherStub implements Hasher {
  async hash(_password: string): Promise<string> {
    return 'hashed_password'
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail(_email: string): Promise<AccountModel | undefined> {
    return undefined
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add(_account: AddAccountModel): Promise<AccountModel> {
    return makeFakeAccount()
  }
}

const hasherStub = new HasherStub()
const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
const addAccountRepositoryStub = new AddAccountRepositoryStub()

const makeSut = () => {
  return new DbAddAccountUseCase(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )
}

describe('DbAddAccountUseCase', () => {
  const account = {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  }

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )
    const sut = makeSut()
    await sut.add(account)
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  it('Should return an EmailAlreadyInUseError when an account was found by the given email address', async () => {
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(makeFakeAccount())
    const sut = makeSut()
    const result = await sut.add(account)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new EmailAlreadyInUseError())
  })

  it('Should return a LoadAccountByEmailRepositoryError if  LoadAccountByEmailRepository throws', async () => {
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error())
    const sut = makeSut()
    const result = await sut.add(account)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new LoadAccountByEmailRepositoryError())
  })

  it('Should call Hasher with correct password', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(account)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should return HasherError if Hasher throws', async () => {
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      throw new Error()
    })
    const sut = makeSut()
    const result = await sut.add(account)
    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.error).toEqual(new HasherError())
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

  it('Should return AddAccountRepositoryError if AddAccountRepository throws', async () => {
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(async () => {
        throw new Error()
      })
    const sut = makeSut()
    const result = await sut.add(account)
    expect(result.isFailure()).toBe(true)
    if (result.isFailure()) {
      expect(result.error).toEqual(new AddAccountRepositoryError())
    }
  })

  it('Should return an account on success', async () => {
    const sut = makeSut()
    const result = await sut.add(account)
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.data).toEqual(makeFakeAccount())
    }
  })
})
