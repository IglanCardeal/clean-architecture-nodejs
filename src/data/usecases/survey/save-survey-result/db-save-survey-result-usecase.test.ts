import { DbSaveSurveyResultUseCase } from './db-save-survey-result-usecase'
import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-usecase-protocols'

const anyDate = new Date()
const makeFakeSaveSurveyResultModel = () => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: anyDate
})

class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
  async save(_survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return { ...makeFakeSaveSurveyResultModel(), id: 'any_id' }
  }
}

const makeSut = () => {
  const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub()
  return {
    sut: new DbSaveSurveyResultUseCase(saveSurveyResultRepositoryStub),
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResultUseCase', () => {
  it('Should call SaveSurveyResultRepository with correct survey data', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    await sut.save(makeFakeSaveSurveyResultModel())

    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResultModel())
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockRejectedValueOnce(new Error())

    await expect(sut.save(makeFakeSaveSurveyResultModel())).rejects.toThrow()
  })
})
