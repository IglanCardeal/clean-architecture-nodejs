import {
  AddSurveyRepository,
  ListSurveysRepository,
  LoadSurveyByIdRepository
} from '@src/data/protocols/db'
import { SurveyModel } from '@src/domain/models/survey'
import { MongoHelper } from '@src/infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    ListSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(survey: SurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async getList(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    return (await surveyCollection.find().toArray()) as unknown as SurveyModel[]
  }

  async load(surveyId: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const data = await surveyCollection.findOne({ _id: new ObjectId(surveyId) })
    if (!data) return null
    return data as unknown as SurveyModel
  }
}
