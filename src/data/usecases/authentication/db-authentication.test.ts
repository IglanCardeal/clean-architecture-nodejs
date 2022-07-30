import { AuthModel } from '@src/domain/usecases/authentication'
import { AccountModel } from './db-authentication-protocols'
import { DbAuthenticationUseCase } from './db-authentication'
import { LoadAccountByEmailRepository } from './db-authentication-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any@email.com',
  password: 'hashed_password'
})

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load(_email: string): Promise<AccountModel> {
    return makeFakeAccount()
  }
}

const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
const makeSut = () =>
  new DbAuthenticationUseCase(loadAccountByEmailRepositoryStub)

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
})
