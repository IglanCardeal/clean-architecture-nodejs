import {
  AddAccountRepositoryError,
  DbAddAccountResult
} from '@src/data/usecases/add-account/db-add-account-usecase-result'
import { MissingParamError, ServerError } from '@src/presentation/errors'
import {
  badRequest,
  created,
  serverError
} from '@src/presentation/helpers/http'
import { failure, success } from '@src/shared/either'
import { SignUpController } from './signup-controller'
import {
  AccountModel,
  Validation,
  AddAccountUseCase,
  AddAccountModel
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

const makeSut = () => {
  const addAccountUseCaseStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(validationStub, addAccountUseCaseStub)
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

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created(makeFakeAccount()))
  })
})
