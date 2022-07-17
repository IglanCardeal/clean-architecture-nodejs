import {
  DatabaseError,
  DbAddAccountResult
} from '@src/data/usecases/add-account/add-account-results'
import {
  AddAccountUseCase,
  AddAccountModel
} from '@src/domain/usecases/add-account'
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from '@src/presentation/errors'
import { EmailValidator } from '@src/presentation/protocols'
import { failure, success } from '@src/shared/either'
import { SignUpController } from './signup-controller'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccountUseCase<DbAddAccountResult> => {
  class AddAccountUseCaseStub implements AddAccountUseCase<DbAddAccountResult> {
    async add(account: AddAccountModel): Promise<DbAddAccountResult> {
      account
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return success(fakeAccount)
    }
  }
  return new AddAccountUseCaseStub()
}

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountUseCaseStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountUseCaseStub)
  return { sut, emailValidatorStub, addAccountUseCaseStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: '',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: ''
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: 'invalid_pass_confirm'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    )
  })

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'fooemail.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if EmailValidator throws exception', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AddAccount returns an database error', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()

    jest
      .spyOn(addAccountUseCaseStub, 'add')
      .mockImplementationOnce(async () => {
        return failure(new DatabaseError())
      })

    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('foo@email.com')
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountUseCaseStub } = makeSut()
    const addSpy = jest.spyOn(addAccountUseCaseStub, 'add')
    const httpRequest = {
      body: {
        name: 'foo name',
        email: 'foo@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'foo name',
      email: 'foo@email.com',
      password: '123456'
    })
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid name',
        email: 'valid@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
