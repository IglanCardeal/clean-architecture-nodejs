import { DbLoadAccountByTokenUsecase } from './db-load-account-by-token'
import {
  Decrypter,
  LoadAccountByTokenUseCaseProps
} from './db-load-account-by-token-protocols'
import { DecrypterError } from './db-load-account-by-token-result'

class DecrypterStub implements Decrypter {
  async decrypt(_value: string): Promise<string> {
    return 'account_id'
  }
}

const makeSut = () => {
  const decrypterStub = new DecrypterStub()
  return {
    sut: new DbLoadAccountByTokenUsecase(decrypterStub),
    decrypterStub
  }
}
const makeFakeProps = (): LoadAccountByTokenUseCaseProps => ({
  accessToken: 'any_token',
  role: 'user'
})

describe('DbLoadAccountByToken Usecase', () => {
  const { decrypterStub, sut } = makeSut()
  const props = makeFakeProps()

  it('Should call Decrypter with correct values', async () => {
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(props)
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return a DecrypterError when Decrypter throws', async () => {
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const result = await sut.load(props)
    const error = result.isFailure() && result.error
    expect(error).toEqual(new DecrypterError())
  })
})
