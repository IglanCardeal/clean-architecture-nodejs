import {
  badRequest,
  forbidden,
  serverError
} from '@src/presentation/helpers/http'
import {
  Body,
  SaveSurveyResultController
} from './save-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyByIdUseCase,
  SurveyModel
} from './save-survey-result-controller-protocols'
import { InvalidParamError, MissingParamError } from '@src/presentation/errors'

const anyDate = new Date()
const makeFakeSurveyModel = (): SurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: anyDate
})

class LoadSurveyByIdUseCaseStub implements LoadSurveyByIdUseCase {
  async loadById(_id: string): Promise<SurveyModel | null> {
    return makeFakeSurveyModel()
  }
}

const makeSut = () => {
  const loadSurveyByIdUseCaseStub = new LoadSurveyByIdUseCaseStub()
  return {
    sut: new SaveSurveyResultController(loadSurveyByIdUseCaseStub),
    loadSurveyByIdUseCaseStub
  }
}

const surveyId = 'any_survey_id'
const answer = 'any_answer'

const makeFakeRequest = (): HttpRequest<Body, never> => ({
  body: {
    surveyId,
    answer
  }
})

describe('SaveSurveyResultController', () => {
  it('Should return 400 if missing survey id', async () => {
    const { sut } = makeSut()

    const result = await sut.handle({ body: { surveyId: '', answer } })

    expect(result).toEqual(badRequest(new MissingParamError('survey id')))
  })

  it('Should call LoadSurveyByIdUseCase with correct survey id', async () => {
    const { sut, loadSurveyByIdUseCaseStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdUseCaseStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith(surveyId)
  })

  it('Should returns 403 if LoadSurveyByIdUseCase returns null', async () => {
    const { sut, loadSurveyByIdUseCaseStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdUseCaseStub, 'loadById')
      .mockResolvedValueOnce(null)

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  it('Should returns 500 if LoadSurveyByIdUseCase throws', async () => {
    const { sut, loadSurveyByIdUseCaseStub } = makeSut()
    const anyServerError = new Error()
    jest
      .spyOn(loadSurveyByIdUseCaseStub, 'loadById')
      .mockRejectedValueOnce(anyServerError)

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(serverError(anyServerError))
  })

  it('Should returns 400 if an no answer is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.handle({
      body: {
        answer: '',
        surveyId
      }
    })

    expect(result).toEqual(badRequest(new MissingParamError('answer')))
  })
})
