import {
  AddAccountRepositoryError,
  DbAddAccountResult
} from '@src/data/usecases/add-account/db-add-account-usecase-result'
import {
  DbAuthenticationUseCaseResult,
  UserAccessToken
} from '@src/data/usecases/authentication/db-authentication-usecase-result'
import { EmailAlreadyInUseError } from '@src/domain/errors'
import { MissingParamError, ServerError } from '@src/presentation/errors'
import {
  badRequest,
  conflict,
  created,
  serverError
} from '@src/presentation/helpers/http'
import { failure, success } from '@src/shared/either'
import { SignUpController } from './signup-controller'
import {
  AccountModel,
  Validation,
  AddAccountUseCase,
  AddAccountModel,
  AuthenticationUseCase
} from './signup-controller-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccountUseCase<DbAddAccountResult> => {
  class AddAccountUseCaseStub implements AddAccountUseCase<DbAddAccountResult> {
    async add(_account: AddAccountModel): Promise<DbAddAccountResult> {
      return success(makeFakeAccount())
    }
  }
  return new AddAccountUseCaseStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): void | Error {
      return undefined
    }
  }
  return new ValidationStub()
}

class AuthenticationUseCaseStub
  implements AuthenticationUseCase<DbAuthenticationUseCaseResult>
{
  async auth({
    _email,
    _password
  }: any): Promise<DbAuthenticationUseCaseResult> {
    return success(new UserAccessToken('auth_token'))
  }
}

const addAccountUseCaseStub = makeAddAccount()
const validationStub = makeValidation()
const authenticationUseCaseStub = new AuthenticationUseCaseStub()

const makeSut = () => {
  const sut = new SignUpController(
    validationStub,
    addAccountUseCaseStub,
    authenticationUseCaseStub
  )
  return { sut, addAccountUseCaseStub, validationStub }
}

describe('SignUp Controller', () => {
  const httpRequest = {
    body: {
      name: 'foo name',
      email: 'foo@email.com',
      password: '123456',
      passwordConfirmation: '123456'
    }
  }

  it('Should return 500 if AddAccount returns an database error', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()
    const addAccountRepositoryError = new AddAccountRepositoryError()
    jest
      .spyOn(addAccountUseCaseStub, 'add')
      .mockResolvedValueOnce(failure(addAccountRepositoryError))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()
    const addSpy = jest.spyOn(addAccountUseCaseStub, 'add')
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'foo name',
      email: 'foo@email.com',
      password: '123456'
    })
  })

  it('Should return 409 if the given request data generates a conflict', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()
    jest
      .spyOn(addAccountUseCaseStub, 'add')
      .mockResolvedValueOnce(failure(new EmailAlreadyInUseError()))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(conflict(new EmailAlreadyInUseError()))
  })

  it('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created({ accessToken: 'auth_token' }))
  })

  it('Should call AuthenticationUseCase with correct values', async () => {
    const { sut } = makeSut()
    const authSpy = jest.spyOn(authenticationUseCaseStub, 'auth')
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'foo@email.com',
      password: '123456'
    })
  })

  it('Should returns 500 if AuthenticationUseCase returns any error', async () => {
    const { sut } = makeSut()
    jest
      .spyOn(authenticationUseCaseStub, 'auth')
      .mockResolvedValueOnce(failure(new Error('any')))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error('any')))
  })
})
