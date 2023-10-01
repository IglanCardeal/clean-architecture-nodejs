import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import {
  mockSaveSurveyResultModel,
  mockSurveyResultModel
} from '@src/shared/helpers/mocks'

const makeSut = () => new SurveyResultMongoRepository()

describe('SurveyResultMongoRepository', () => {
  const sut = makeSut()
  let surveyCollection: Collection<Document>

  beforeAll(async () => {
    await MongoHelper.connect()
    surveyCollection = await MongoHelper.getCollection('surveyResults')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
  })

  describe('save', () => {
    it('Should save a survey result if its a new one', async () => {
      const result = await sut.save(mockSaveSurveyResultModel())
      expect(result).toMatchObject({
        ...mockSaveSurveyResultModel(),
        id: expect.any(String)
      })
    })

    it('Should update the survey result if it already exist', async () => {
      const saved = await sut.save(mockSaveSurveyResultModel())
      const updated = await sut.save(mockSurveyResultModel())
      expect(saved.id).toBe(updated.id)
      expect(updated).toMatchObject({
        ...mockSurveyResultModel(),
        id: expect.any(String)
      })
    })
  })
})
