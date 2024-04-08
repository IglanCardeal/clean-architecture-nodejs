import { SurveyModel } from '@src/domain/models/survey'
import { SurveyResultModel } from '@src/domain/models/survey-result'
import {
  LoadSurveyByIdUseCase,
  LoadSurveyResultUseCase,
  SaveSurveyResultParams,
  SaveSurveyResultUseCase
} from '@src/domain/usecases/survey'
import {
  mockSurveyModel,
  mockSurveyResultModel
} from '@src/shared/helpers/mocks'

export class LoadSurveyByIdUseCaseStub implements LoadSurveyByIdUseCase {
  async loadById(_id: string): Promise<SurveyModel | null> {
    return mockSurveyModel()
  }
}

export class LoadSurveyResultUseCaseStub implements LoadSurveyResultUseCase {
  async load(_surveyId: string): Promise<SurveyResultModel> {
    return mockSurveyResultModel()
  }
}

export class SaveSurveyResultUseCaseStub implements SaveSurveyResultUseCase {
  async save(_data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return mockSurveyResultModel()
  }
}
