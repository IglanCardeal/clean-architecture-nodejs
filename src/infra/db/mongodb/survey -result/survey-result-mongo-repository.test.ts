import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultModel } from '@src/domain/usecases/survey/save-survey-result'

const anyDate = new Date()
const makeSut = () => new SurveyResultMongoRepository()
const makeFakeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: anyDate
})

describe('SurveyResultMongoRepository', () => {
  const sut = makeSut()
  let surveyCollection: Collection<Document>

  beforeAll(async () => {
    await MongoHelper.connect()
    surveyCollection = await MongoHelper.getCollection('surveys')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
  })

  describe('save', () => {
    it('Should save a survey result if its a new one', async () => {
      const result = await sut.save(makeFakeSaveSurveyResultModel())
      expect(result).toMatchObject({
        ...makeFakeSaveSurveyResultModel(),
        id: expect.any(String)
      })
    })
  })
})
