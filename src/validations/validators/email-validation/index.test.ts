import { InvalidParamError } from '@src/presentation/errors'
import { EmailValidator } from '@src/validations/protocols'
import { EmailValidation } from '.'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Email Validation', () => {
  const httpRequest = {
    email: 'foo@email.com'
  }

  it('Should throw if EmailValidator throws exception', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(httpRequest)
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('Should throw if EmailValidator throws exception', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('foo@email.com')
  })
})
