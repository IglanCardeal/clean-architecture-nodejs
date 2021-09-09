import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup-controller'

interface SutResponse {
  emailValidatorStub: EmailValidator
  sut: SignUpController
}

const makeSut = (): SutResponse => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      email
      return false
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return { sut, emailValidatorStub }
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
})
