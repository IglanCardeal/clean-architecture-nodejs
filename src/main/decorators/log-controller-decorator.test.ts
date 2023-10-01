import { ok, serverError } from '@src/presentation/helpers/http'
import { HttpRequest } from '@src/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import {
  mockController,
  mockLogRepository
} from '@src/shared/helpers/stubs/db/log'
import { mockUuidGenerator } from '@src/shared/helpers/stubs/crypto'

const logRepositoryStub = mockLogRepository()
const anyControllerStub = mockController()
const uuidStub = mockUuidGenerator()
const makeSut = () =>
  new LogControllerDecorator(anyControllerStub, logRepositoryStub, uuidStub)
const makeServerError = () => {
  const anyServerErrorStub = new Error()
  anyServerErrorStub.stack = 'any_stack'
  return serverError(anyServerErrorStub)
}

describe('Log Controller Decorator', () => {
  const httpRequest: HttpRequest = {
    body: {
      name: 'Foo',
      email: 'foo@mail.com',
      password: '123foo',
      passwordConfirmation: '123foo'
    }
  }

  it('Should call controller handle with correct values', async () => {
    const sut = makeSut()
    const anyControllerHandleSpy = jest.spyOn(anyControllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(anyControllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return controller handle response with correct values and the transaction id', async () => {
    const sut = makeSut()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({ ...ok('ok'), transactionId: 'unique_id' })
  })

  it('Should call LogRepository with the correct request data and transaction id', async () => {
    const logInfoSpy = jest.spyOn(logRepositoryStub, 'logInfo')
    const sut = makeSut()
    await sut.handle(httpRequest)
    expect(logInfoSpy).toHaveBeenCalledWith({
      ...ok('ok'),
      transactionId: 'unique_id'
    })
  })

  it('Should call LogRepository with the correct error and transaction id if the controller returns a server error', async () => {
    jest.spyOn(anyControllerStub, 'handle').mockResolvedValue(makeServerError())
    const logErrorSpy = jest.spyOn(logRepositoryStub, 'logError')
    const sut = makeSut()
    await sut.handle(httpRequest)
    expect(logErrorSpy).toHaveBeenCalledWith({
      body: {
        email: 'foo@mail.com',
        name: 'Foo',
        password: '123foo',
        passwordConfirmation: '123foo'
      },
      stack: 'any_stack',
      transactionId: 'unique_id'
    })
  })
})
