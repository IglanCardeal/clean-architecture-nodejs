import { AuthModel } from '@src/domain/usecases/authentication'
import {
  AccountModel,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { DbAuthenticationUseCase } from './db-authentication'
import {
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator
} from './db-authentication-protocols'
import {
  HasherComparerError,
  LoadAccountByEmailRepositoryError,
  TokenGeneratorError
} from './db-authentication-result'
import { InvalidCredentialsError } from '@src/domain/errors'

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

class TokenGeneratorStub implements TokenGenerator {
  async generate(_id: string): Promise<string> {
    return 'access_token'
  }
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  async update(_userId: string, _acessToken: string): Promise<void> {
    return undefined
  }
}

const loadAccountError = new Error()
const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
const hashComparerStub = new HashComparerStub()
const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
const tokenGeneratorStub = new TokenGeneratorStub()
const makeSut = () =>
  new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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

  it('Should return an InvalidCredentialsError if LoadAccountByEmailRepository returns undefined', async () => {
    const sut = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockResolvedValueOnce(undefined)
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new InvalidCredentialsError())
  })

  it('Should call HashComparer with correct values', async () => {
    const sut = makeSut()
    const loadSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(authModel)
    expect(loadSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Should return a HasherComparerError if HasherComparer throws', async () => {
    const sut = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new HasherComparerError())
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const sut = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(authModel)
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'access_token')
  })

  it('Should return an InvalidCredentialsError if HashComparer returns false', async () => {
    const sut = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new InvalidCredentialsError())
  })

  it('Should call TokenGenerator with correct user id', async () => {
    const sut = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(authModel)
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return a TokenGeneratorError if TokenGenerator throws', async () => {
    const sut = makeSut()
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockRejectedValueOnce(new Error())
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new TokenGeneratorError())
  })

  it('Should return an access token when success', async () => {
    const sut = makeSut()
    const result = await sut.auth(authModel)
    const data = result.isSuccess() && result.data
    expect(result.isSuccess()).toBe(true)
    expect(data).toBe('access_token')
  })
})
