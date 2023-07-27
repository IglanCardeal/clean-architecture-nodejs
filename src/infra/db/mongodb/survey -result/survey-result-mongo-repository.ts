import { SaveSurveyResultRepository } from '@src/data/protocols/db'
import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultModel } from '@src/domain/usecases/survey/save-survey-result'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const inserted = await surveyCollection.insertOne(survey)
    return {
      ...survey,
      id: inserted.insertedId.toString()
    }
  }
}
