import {
  AddAccountRepositoryError,
  DbAddAccountResult
} from '@src/data/usecases/add-account/db-add-account-result'
import { MissingParamError, InvalidParamError } from '@src/presentation/errors'
import {
  badRequest,
  created,
  serverError
} from '@src/presentation/helpers/http-helper'
import { EmailValidator } from '@src/presentation/protocols'
import { failure, success } from '@src/shared/either'
import { SignUpController } from './signup-controller'
import {
  AccountModel,
  Validation,
  AddAccountUseCase,
  AddAccountModel
} from './signup-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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
  const emailValidatorStub = makeEmailValidator()
  const addAccountUseCaseStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(
    emailValidatorStub,
    validationStub,
    addAccountUseCaseStub
  )
  return { sut, emailValidatorStub, addAccountUseCaseStub, validationStub }
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

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidator throws exception', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const validatorError = new Error()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw validatorError
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 500 if AddAccount returns an database error', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()
    const addAccountRepositoryError = new AddAccountRepositoryError()
    jest
      .spyOn(addAccountUseCaseStub, 'add')
      .mockResolvedValueOnce(failure(addAccountRepositoryError))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('foo@email.com')
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
