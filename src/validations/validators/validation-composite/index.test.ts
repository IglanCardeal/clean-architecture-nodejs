import { MissingParamError } from '@src/presentation/errors'
import { makeValidation } from '@src/shared/helpers/stubs/validators'
import { ValidationComposite } from '.'

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
