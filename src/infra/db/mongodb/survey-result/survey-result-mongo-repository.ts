import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@src/data/protocols/db'
import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey/save-survey-result'
import { MongoHelper } from '@src/infra/db/mongodb/helpers'
import { ObjectId } from 'mongodb'
import { getLoadBySurveyIdQuery } from '../queries'

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository
{
  async save(survey: SaveSurveyResultParams): Promise<void> {
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
  }

  public async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    const query = getLoadBySurveyIdQuery(surveyId, accountId)
    const surveyResult = await surveyCollection.aggregate(query).toArray()
    return (surveyResult[0] || null) as SurveyResultModel
  }
}
