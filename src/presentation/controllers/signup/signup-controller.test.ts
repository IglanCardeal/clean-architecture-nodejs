import { AccountModel } from '@src/domain/models/account'
import { AddAccount, AddAccountModel } from '@src/domain/usecases/add-account'
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from '@src/presentation/errors'
import { EmailValidator } from '@src/presentation/protocols'
import { SignUpController } from './signup-controller'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      email
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      account
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
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
  it('Should return 400 if no name was provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email was provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: '',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password was provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation was provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: ''
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  it('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: 'invalid_pass_confirm'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    )
  })

  it('Should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'fooemail.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if EmailValidator throws exception', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AddAccount throws exception', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('foo@email.com')
  })

  it('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'foo name',
      email: 'foo@email.com',
      password: '123456'
    })
  })

  it('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid name',
        email: 'valid@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
