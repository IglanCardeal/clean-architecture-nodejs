import { AuthModel } from '@src/domain/usecases/authentication'
import { AccountModel } from './db-authentication-protocols'
import { DbAuthenticationUseCase } from './db-authentication'
import {
  LoadAccountByEmailRepository,
  HashComparer
} from './db-authentication-protocols'
import {
  HasherComparerError,
  LoadAccountByEmailRepositoryError
} from './db-authentication-result'
import { AccountNotFoundError } from '@src/domain/errors'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any@email.com',
  password: 'hashed_password'
})

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load(_email: string): Promise<AccountModel | undefined> {
    return makeFakeAccount()
  }
}

class HashComparerStub implements HashComparer {
  async compare(_password: string, _hash: string): Promise<boolean> {
    return true
  }
}

const loadAccountError = new Error()
const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
const hashComparerStub = new HashComparerStub()
const makeSut = () =>
  new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  )

describe('DbAuthenticationUseCase', () => {
  const authModel: AuthModel = {
    email: 'any@mail.com',
    password: 'any_password'
  }

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(authModel)
    expect(loadSpy).toHaveBeenCalledWith('any@mail.com')
  })

  it('Should return a LoadAccountByEmailRepositoryError if LoadAccountByEmailRepository throws', async () => {
    const sut = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockImplementationOnce(() => {
        throw loadAccountError
      })
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(
      new LoadAccountByEmailRepositoryError(loadAccountError.stack)
    )
  })

  it('Should return an AccountNotFoundError if LoadAccountByEmailRepository returns undefined', async () => {
    const sut = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockResolvedValueOnce(undefined)
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new AccountNotFoundError())
  })

  it('Should call HashComparer with correct values', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(authModel)
    expect(loadSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Should return an HasherComparerError if HasherComparer throws', async () => {
    const sut = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValue(new Error())
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new HasherComparerError())
  })
})
