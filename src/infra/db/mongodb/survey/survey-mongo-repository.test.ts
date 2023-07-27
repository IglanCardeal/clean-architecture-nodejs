import { SurveyModel } from '@src/domain/models/survey'
import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const anyDate = new Date()
const makeSut = () => new SurveyMongoRepository()
const makeFakeSurveyData = (): SurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: anyDate
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
      expect(surveySaved).toMatchObject(makeFakeSurveyData())
    })
  })

  describe('getList', () => {
    it('Should return surveys list on success', async () => {
      await Promise.all([
        sut.add(makeFakeSurveyData()),
        sut.add(makeFakeSurveyData())
      ])

      const result = await sut.getList()

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject(makeFakeSurveyData())
    })

    it('Should return an empty list when no surveys', async () => {
      const result = await sut.getList()

      expect(result).toHaveLength(0)
    })
  })

  describe('load', () => {
    it('Should load survey by id', async () => {
      const inserted = await surveyCollection.insertOne(makeFakeSurveyData())
      const surveyId = inserted.insertedId.toString()

      const result = await sut.load(surveyId)

      expect(result).toMatchObject(makeFakeSurveyData())
    })

    it('Should return null if no survey', async () => {
      const noExistId = '507f1f77bcf86cd799439011'

      const result = await sut.load(noExistId)

      expect(result).toBeNull()
    })
  })
})
