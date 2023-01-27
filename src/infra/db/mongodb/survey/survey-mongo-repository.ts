import { AddSurveyRepository } from '@src/data/protocols/db'
import { AddSurveyModel } from '@src/domain/usecases/add-survey'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(survey: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }
}
