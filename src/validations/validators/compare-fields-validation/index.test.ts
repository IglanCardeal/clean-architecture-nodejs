import { InvalidParamError } from '@src/presentation/errors'
import { CompareFieldsValidation } from '.'

const makeSut = () => new CompareFieldsValidation('field', 'fieldToCompare')

describe('Compare Fields Validation', () => {
  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const result = sut.validate({ field: 'any_value', fieldToCompare: '' })
    expect(result).toEqual(new InvalidParamError('fieldToCompare'))
    const result2 = sut.validate({
      field: 'any_value',
      fieldToCompare: 'value_any'
    })
    expect(result2).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Should not return a InvalidParamError if validation succeeds', () => {
    const sut = makeSut()
    const result = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(result).toBeFalsy()
  })
})
