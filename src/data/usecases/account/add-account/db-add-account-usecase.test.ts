import {
  AddAccountParams,
  AccountModel,
  AddAccountRepository
} from './db-add-account-usecase-protocols'
import {
  HasherError,
  AddAccountRepositoryError,
  LoadAccountByEmailRepositoryError
} from './db-add-account-usecase-result'
import { DbAddAccountUseCase } from './db-add-account-usecase'
import { EmailAlreadyInUseError } from '@src/domain/errors'
import { mockAccount } from '@src/shared/helpers/mocks'
import { makeLoadAccountByEmailRepositoryStub } from '@src/shared/helpers/stubs'
import { makeHasherStub } from '@src/shared/helpers/stubs/crypto'

class AddAccountRepositoryStub implements AddAccountRepository {
  async add(_account: AddAccountParams): Promise<AccountModel> {
    return mockAccount()
  }
}

const makeSut = () => {
  const hasherStub = makeHasherStub()
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return {
    sut: new DbAddAccountUseCase(
      hasherStub,
      addAccountRepositoryStub,
      loadAccountByEmailRepositoryStub
    ),
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccountUseCase', () => {
  const {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  } = makeSut()
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
    await sut.add(account)
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  it('Should return an EmailAlreadyInUseError when an account was found by the given email address', async () => {
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(mockAccount())
    const result = await sut.add(account)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new EmailAlreadyInUseError())
  })

  it('Should return a LoadAccountByEmailRepositoryError if  LoadAccountByEmailRepository throws', async () => {
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error())
    const result = await sut.add(account)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new LoadAccountByEmailRepositoryError())
  })

  it('Should call Hasher with correct password', async () => {
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(account)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should return HasherError if Hasher throws', async () => {
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      throw new Error()
    })
    const result = await sut.add(account)
    expect(result.isFailure() && result.error).toEqual(new HasherError())
  })

  it('Should call AddAccountRepository with correct values', async () => {
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
    const result = await sut.add(account)
    expect(result.isFailure() && result.error).toEqual(
      new AddAccountRepositoryError()
    )
  })

  it('Should return an account on success', async () => {
    const result = await sut.add(account)
    expect(result.isSuccess() && result.data).toEqual(mockAccount())
  })
})
