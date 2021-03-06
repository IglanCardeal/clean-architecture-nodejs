import {
  AddAccountRepositoryError,
  DbAddAccountResult
} from '@src/data/usecases/add-account/db-add-account-result'
import {
  AddAccountUseCase,
  AddAccountModel
} from '@src/domain/usecases/add-account'
import { MissingParamError, InvalidParamError } from '@src/presentation/errors'
import {
  badRequest,
  created,
  serverError
} from '@src/presentation/helpers/http-helper'
import { EmailValidator } from '@src/presentation/protocols'
import { failure, success } from '@src/shared/either'
import { SignUpController } from './signup-controller'
import { AccountModel } from './signup-protocols'

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

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountUseCaseStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountUseCaseStub)
  return { sut, emailValidatorStub, addAccountUseCaseStub }
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

  it('Should return 400 if no name was provided', async () => {
    const { sut } = makeSut()
    const invalidHttpRequest = {
      body: {
        ...httpRequest.body,
        name: ''
      }
    }
    const httpResponse = await sut.handle(invalidHttpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Should return 400 if no email was provided', async () => {
    const { sut } = makeSut()
    const invalidHttpRequest = {
      body: {
        ...httpRequest.body,
        email: ''
      }
    }
    const httpResponse = await sut.handle(invalidHttpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password was provided', async () => {
    const { sut } = makeSut()
    const invalidHttpRequest = {
      body: {
        ...httpRequest.body,
        password: ''
      }
    }
    const httpResponse = await sut.handle(invalidHttpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if no password confirmation was provided', async () => {
    const { sut } = makeSut()
    const invalidHttpRequest = {
      body: {
        ...httpRequest.body,
        passwordConfirmation: ''
      }
    }
    const httpResponse = await sut.handle(invalidHttpRequest)
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    )
  })

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const invalidHttpRequest = {
      body: {
        ...httpRequest.body,
        passwordConfirmation: 'invalid_pass_confirm'
      }
    }
    const httpResponse = await sut.handle(invalidHttpRequest)
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    )
  })

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
