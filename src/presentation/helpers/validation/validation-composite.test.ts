import { MissingParamError } from '@src/presentation/errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): void | Error {
      return undefined
    }
  }
  return new ValidationStub()
}

const validationsStub = [makeValidation(), makeValidation()]
const makeSut = () => new ValidationComposite(validationsStub)

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const sut = makeSut()
    jest
      .spyOn(validationsStub[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return the first error if more than one validation fails', () => {
    const sut = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(new Error())
    jest
      .spyOn(validationsStub[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({})
    expect(error).toEqual(new Error())
  })

  it('Should not return an error if all validation succeeds', () => {
    jest.resetAllMocks()
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toBeFalsy()
  })
})
