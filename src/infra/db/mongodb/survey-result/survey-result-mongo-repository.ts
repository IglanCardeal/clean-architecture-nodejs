import { SaveSurveyResultRepository } from '@src/data/protocols/db'
import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey/save-survey-result'
import { MongoHelper } from '@src/infra/db/mongodb/helpers'
import { ObjectId } from 'mongodb'
import { getLoadBySurveyIdQuery } from '../queries'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(survey.surveyId),
        accountId: new ObjectId(survey.accountId)
      },
      {
        $set: {
          answer: survey.answer,
          date: survey.date
        }
      },
      { upsert: true }
    )
    return this.loadBySurveyId(survey.surveyId)
  }

  private async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    const query = getLoadBySurveyIdQuery(surveyId)
    const surveyResult = await surveyCollection.aggregate(query).toArray()
    return surveyResult?.[0] as SurveyResultModel
  }
}
