import { MissingParamError } from '@src/presentation/errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): void | Error {
      return new MissingParamError('field')
    }
  }
  return new ValidationStub()
}

const validationStub = makeValidation()
const makeSut = () => new ValidationComposite([validationStub])

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })
})
