import { Either, failure, success } from './'

class SuccessData {
  constructor(readonly data: any) {}
}

class FailureData {
  constructor(readonly data: any) {}
}

describe('Either type', () => {
  it('Should return isSuccess true and success data', () => {
    const result: Either<SuccessData, FailureData> = success(
      new SuccessData({})
    )
    expect(result.isSuccess()).toBe(true)
    expect(result.isFailure()).toBe(false)
  })

  it('Should return isSuccess false and isFailure true', () => {
    const result: Either<SuccessData, FailureData> = failure(
      new FailureData({})
    )
    expect(result.isFailure()).toBe(true)
    expect(result.isSuccess()).toBe(false)
  })
})
