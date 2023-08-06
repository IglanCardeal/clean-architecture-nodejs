import { badRequest } from '@src/presentation/helpers/http'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  LoadSurveyByIdUseCase,
  SurveyModel
} from './save-survey-result-controller-protocols'
import { MissingSurveyId } from '@src/domain/errors'

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

describe('SaveSurveyResultController', () => {
  it('Should return 400 if missing survey id', async () => {
    const { sut } = makeSut()

    const result = await sut.handle({ body: { surveyId: '' } })

    expect(result).toEqual(badRequest(new MissingSurveyId()))
  })
})
