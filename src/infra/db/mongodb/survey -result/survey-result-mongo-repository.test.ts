import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey/save-survey-result'

const anyDate = new Date()
const makeSut = () => new SurveyResultMongoRepository()
const makeFakeSaveSurveyResultModel = (): SaveSurveyResultParams => ({
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: anyDate
})
const makeFakeUpdatedSaveSurveyResultModel = (): SaveSurveyResultParams => ({
  ...makeFakeSaveSurveyResultModel(),
  answer: 'updated_answer'
})

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
      const result = await sut.save(makeFakeSaveSurveyResultModel())
      expect(result).toMatchObject({
        ...makeFakeSaveSurveyResultModel(),
        id: expect.any(String)
      })
    })

    it('Should update the survey result if it already exist', async () => {
      const saved = await sut.save(makeFakeSaveSurveyResultModel())
      const updated = await sut.save(makeFakeUpdatedSaveSurveyResultModel())
      expect(saved.id).toBe(updated.id)
      expect(updated).toMatchObject({
        ...makeFakeUpdatedSaveSurveyResultModel(),
        id: expect.any(String)
      })
    })
  })
})
