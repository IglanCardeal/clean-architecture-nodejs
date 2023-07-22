import { SurveyModel } from '@src/domain/models/survey'
import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSut = () => new SurveyMongoRepository()
const makeFakeSurveyData = (): SurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

describe('Surveys MongoDB Repository', () => {
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

  describe('add', () => {
    it('Should save a survey on add success', async () => {
      await sut.add(makeFakeSurveyData())
      const surveySaved = await surveyCollection.findOne({
        question: 'any_question'
      })
      expect(surveySaved).toMatchObject({
        ...makeFakeSurveyData(),
        date: expect.any(Date)
      })
    })
  })
})
