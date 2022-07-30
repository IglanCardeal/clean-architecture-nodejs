import { InvalidParamError } from '@src/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = () => new CompareFieldsValidation('field', 'fieldToCompare')

describe('Compare Fields Validation', () => {
  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const result = sut.validate({ field: 'any_value', fieldToCompare: '' })
    expect(result).toEqual(new InvalidParamError('fieldToCompare'))
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
