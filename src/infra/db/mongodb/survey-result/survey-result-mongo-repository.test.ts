import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@src/domain/models/survey'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey'

const makeSut = () => new SurveyResultMongoRepository()

describe('SurveyResultMongoRepository', () => {
  const sut = makeSut()
  let surveyCollection: Collection<Document>
  let surveyResultsCollection: Collection<Document>
  let accountCollection: Collection

  const makeSurvey = async (): Promise<SurveyModel> => {
    const res = await surveyCollection.insertOne({
      question: 'any_question',
      answers: [
        { image: 'any_image', answer: 'any_answer' },
        { answer: 'other_answer' },
        { answer: 'any_other_answer' }
      ],
      date: new Date()
    })
    const survey = await surveyCollection.findOne({ _id: res.insertedId })
    return {
      ...survey,
      id: MongoHelper.mapDocumentIdToString({ _id: res.insertedId })
    } as any
  }

  const makeAccount = async (): Promise<{ id: string }> => {
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })

    return { id: MongoHelper.mapDocumentIdToString({ _id: res.insertedId }) }
  }

  beforeAll(async () => {
    await MongoHelper.connect()
    surveyCollection = await MongoHelper.getCollection('surveys')
    surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    accountCollection = await MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await surveyResultsCollection.deleteMany({})
  })

  describe('save', () => {
    it('Should save a survey result if its a new one', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()
      const saveSurveyResultParams: SaveSurveyResultParams = {
        answer: survey.answers[0].answer,
        accountId: account.id,
        surveyId: survey.id as string,
        date: new Date()
      }

      const result = await sut.save(saveSurveyResultParams)

      expect(result).toBeDefined()
      expect(String(result.surveyId)).toBe(saveSurveyResultParams.surveyId)
      expect(result.answers[0].percent).toBe(100)
    })

    it('Should update the survey result if it already exist', async () => {
      const account = await makeAccount()
      const account2 = await makeAccount()
      const survey = await makeSurvey()
      const saveSurveyResultParams: SaveSurveyResultParams = {
        answer: survey.answers[0].answer,
        accountId: account.id,
        surveyId: survey.id as string,
        date: new Date()
      }
      const saveSurveyResultParams2: SaveSurveyResultParams = {
        ...saveSurveyResultParams,
        answer: survey.answers[1].answer,
        accountId: account2.id
      }

      await sut.save(saveSurveyResultParams)
      const updated = await sut.save(saveSurveyResultParams2)

      expect(String(updated.surveyId)).toBe(saveSurveyResultParams.surveyId)
      expect(updated.answers[0].count).toBe(1)
      expect(updated.answers[0].percent).toBe(50)
      expect(updated.answers[1].count).toBe(1)
      expect(updated.answers[1].percent).toBe(50)
    })
  })
})
