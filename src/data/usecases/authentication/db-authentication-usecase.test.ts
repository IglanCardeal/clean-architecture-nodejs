import { AuthModel } from '@src/domain/usecases/authentication'
import {
  AccountModel,
  UpdateAccessTokenRepository
} from './db-authentication-usecase-protocols'
import { DbAuthenticationUseCase } from './db-authentication-usecase'
import {
  LoadAccountByEmailRepository,
  HashComparer,
  TokenGenerator
} from './db-authentication-usecase-protocols'
import {
  HasherComparerError,
  LoadAccountByEmailRepositoryError,
  TokenGeneratorError,
  UpdateAccessTokenRepositoryError
} from './db-authentication-usecase-result'
import { InvalidCredentialsError } from '@src/domain/errors'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any@email.com',
  password: 'hashed_password'
})

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail(_email: string): Promise<AccountModel | undefined> {
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
  async updateAccessToken(
    _accountId: string,
    _acessToken: string
  ): Promise<void> {
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
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(authModel)
    expect(loadSpy).toHaveBeenCalledWith('any@mail.com')
  })

  it('Should return a LoadAccountByEmailRepositoryError if LoadAccountByEmailRepository throws', async () => {
    const sut = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
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
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
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

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const sut = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )
    await sut.auth(authModel)
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'access_token')
  })

  it('Should return an UpdateAccessTokenRepositoryError when UpdateAccessTokenRepository throws', async () => {
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(async () => {
        return Promise.reject(new UpdateAccessTokenRepositoryError())
      })
    const sut = makeSut()
    const result = await sut.auth(authModel)
    const error = result.isFailure() && result.error
    expect(result.isFailure()).toBe(true)
    expect(error).toEqual(new UpdateAccessTokenRepositoryError())
  })

  it('Should return an access token on success', async () => {
    const sut = makeSut()
    const result = await sut.auth(authModel)
    const data = result.isSuccess() && result.data
    expect(result.isSuccess()).toBe(true)
    expect(data).toBe('access_token')
  })
})
