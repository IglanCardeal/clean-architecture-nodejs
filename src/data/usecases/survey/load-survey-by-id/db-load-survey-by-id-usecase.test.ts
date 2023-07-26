import { SurveyModel } from '../add-survey/db-add-survey-usecase-protocols'
import { DbLoadSurveyByIdUseCase } from './db-load-survey-by-id-usecase'
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-usecase-protocols'

const anyDate = new Date()
const makeFakeSurveyModel = () => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: anyDate,
  id: 'any_id'
})

class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
  async load(_id: string): Promise<SurveyModel | null> {
    return makeFakeSurveyModel()
  }
}

const makeSut = () => {
  const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()
  return {
    sut: new DbLoadSurveyByIdUseCase(loadSurveyByIdRepositoryStub),
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyByIdUseCase', () => {
  const surveyId = 'any_id'

  it('Should call LoadSurveyByIdRepository with correct survey id', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'load')

    await sut.loadById(surveyId)

    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return survey data on success', async () => {
    const { sut } = makeSut()

    const result = await sut.loadById(surveyId)

    expect(result).toEqual(makeFakeSurveyModel())
  })

  it('Should return null if no survey was found', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'load').mockResolvedValueOnce(null)

    const result = await sut.loadById(surveyId)

    expect(result).toEqual(null)
  })
})
