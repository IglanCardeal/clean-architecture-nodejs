import {
  AddSurveyRepository,
  ListSurveysRepository
} from '@src/data/protocols/db'
import { SurveyModel } from '@src/domain/models/survey'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository
  implements AddSurveyRepository, ListSurveysRepository
{
  async add(survey: SurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async getList(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    return (await surveyCollection.find().toArray()) as unknown as SurveyModel[]
  }
}
