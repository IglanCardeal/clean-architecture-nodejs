import { SaveSurveyResultRepository } from '@src/data/protocols/db'
import { SurveyResultModel } from '@src/domain/models/survey-result'
import { SaveSurveyResultModel } from '@src/domain/usecases/survey/save-survey-result'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    const inserted = await surveyCollection.findOneAndUpdate(
      {
        surveyId: survey.surveyId,
        accountId: survey.accountId
      },
      {
        $set: {
          answer: survey.answer,
          date: survey.date
        }
      },
      { upsert: true, returnDocument: 'after' }
    )
    return {
      ...survey,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: inserted.value!._id.toString() as string
    }
  }
}
