import { AddSurveyRepository } from '@src/data/protocols/db'
import { SurveyModel } from '@src/domain/models/survey'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(survey: SurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }
}
