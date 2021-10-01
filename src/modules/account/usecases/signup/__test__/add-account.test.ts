/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddAccountRepository } from '@src/modules/account/usecases/signup/ports/add-account-repository'
import { Encrypter } from '@src/modules/account/usecases/signup/ports/encrypter'
import { AccountModel } from '@src/domain/models/account'
import { AddAccountModel } from '@src/domain/usecases/add-account'
import { AddAccountService } from '../add-account'

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return 'hashed password'
    }
  }
  return new EncrypterStub()
}

const fakeAccount = {
  id: 'valid_id',
  name: 'valid name',
  email: 'valid@email.com',
  password: 'hashed password'
}

const accountData = {
  name: 'valid name',
  email: 'valid@email.com',
  password: 'valid_password'
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return fakeAccount
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: AddAccountService
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new AddAccountService(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw exception if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const promise = sut.add(accountData)

    expect(promise).rejects.toThrow()
  })

  it('Should call Encrypter with correct password', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid name',
      email: 'valid@email.com',
      password: 'hashed password'
    })
  })

  it('Should throw exception if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error())

    const promise = sut.add(accountData)

    expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(accountData)

    expect(account).toEqual(fakeAccount)
  })
})
