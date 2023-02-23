import validator from 'validator'

import { EmailValidatorAdapter } from '.'

jest.mock('validator', () => ({
  isEmail: (): boolean => {
    return true
  }
}))

const makeSut = () => new EmailValidatorAdapter()

describe('EmailValidator Adapter', () => {
  const sut = makeSut()

  it('Should return false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email.com')
    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const isValid = sut.isValid('valid@email.com')
    expect(isValid).toBe(true)
  })

  it('Should throw if validator throws', () => {
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(() => sut.isValid('invalid_email.com')).toThrow()
  })

  it('Should call validator with correct email', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any@email.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any@email.com')
  })
})
