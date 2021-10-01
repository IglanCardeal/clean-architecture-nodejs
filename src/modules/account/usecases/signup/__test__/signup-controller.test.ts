/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountModel } from '@src/domain/models/account'
import { AddAccount, AddAccountModel } from '@src/domain/usecases/add-account'
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from '@src/shared/errors'
import { badRequest, ok, serverError } from '@src/shared/helpers/http-helper'
import { EmailValidator } from '@src/shared/ports'
import { SignUpController } from '../signup-controller'

const fakeAccount = {
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
}

const makeFakeHttpRequest = () => ({
  body: {
    name: 'foo name',
    email: 'foo@email.com',
    password: '123456',
    passwordConfirmation: '123456'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutResponse {
  emailValidatorStub: EmailValidator
  sut: SignUpController
  addAccountStub: AddAccount
}

const makeSut = (): SutResponse => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name was provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        ...makeFakeHttpRequest().body,
        name: ''
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Should return 400 if no email was provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        ...makeFakeHttpRequest().body,
        email: ''
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password was provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        ...makeFakeHttpRequest().body,
        password: ''
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if no password confirmation was provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        ...makeFakeHttpRequest().body,
        passwordConfirmation: ''
      }
    })

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    )
  })

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        ...makeFakeHttpRequest().body,
        passwordConfirmation: 'invalid_pass_confirm'
      }
    })

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    )
  })

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle({
      body: {
        ...makeFakeHttpRequest().body,
        email: 'fooemail.com'
      }
    })

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidator throws exception', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should return 500 if AddAccount throws exception', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeHttpRequest())

    expect(isValidSpy).toHaveBeenCalledWith('foo@email.com')
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeHttpRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'foo name',
      email: 'foo@email.com',
      password: '123456'
    })
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(fakeAccount))
  })
})
