import {
  AddSurveyRepository,
  ListSurveysRepository,
  LoadSurveyByIdRepository,
  SaveSurveyResultRepository
} from '@src/data/protocols/db'
import { SurveyModel } from '@src/domain/models/survey'
import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey'
import { LoadSurveyResultRepository } from '@src/data/protocols/db'
import {
  mockSurveyModel,
  mockSurveys,
  mockSurveyResultModel
} from '@src/shared/helpers/mocks'

export const mockAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(_survey: SurveyModel): Promise<void> {
      return undefined
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = () => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async load(_id: string): Promise<SurveyModel | null> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = () => {
  class LoadSurveysRepositoryStub implements ListSurveysRepository {
    async getList(): Promise<SurveyModel[]> {
      return mockSurveys()
    }
  }
  return new LoadSurveysRepositoryStub()
}

export const mockSaveSurveyResultRepository = () => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(_survey: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = () => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(_surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultRepositoryStub()
}
