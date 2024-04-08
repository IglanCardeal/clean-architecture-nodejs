import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockSurveyModel } from '@src/shared/helpers/mocks'

const makeSut = () => new SurveyMongoRepository()

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
      await sut.add(mockSurveyModel())
      const surveySaved = await surveyCollection.findOne({
        question: 'any_question'
      })
      expect(surveySaved).toMatchObject(mockSurveyModel())
    })
  })

  describe('getList', () => {
    it('Should return surveys list on success', async () => {
      await Promise.all([
        sut.add(mockSurveyModel()),
        sut.add(mockSurveyModel())
      ])

      const result = await sut.getList()

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject(mockSurveyModel())
    })

    it('Should return an empty list when no surveys', async () => {
      const result = await sut.getList()

      expect(result).toHaveLength(0)
    })
  })

  describe('load', () => {
    it('Should load survey by id', async () => {
      const inserted = await surveyCollection.insertOne(mockSurveyModel())
      const surveyId = inserted.insertedId.toString()

      const result = await sut.load(surveyId)

      expect(result).toMatchObject(mockSurveyModel())
    })

    it('Should return null if no survey', async () => {
      const noExistId = '507f1f77bcf86cd799439011'

      const result = await sut.load(noExistId)

      expect(result).toBeNull()
    })
  })
})
