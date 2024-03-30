import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultParams } from '@src/domain/usecases/survey'
import { makeAccount, makeSurvey } from '../helpers/mocks'

const makeSut = () => new SurveyResultMongoRepository()

describe('SurveyResultMongoRepository', () => {
  const sut = makeSut()
  let surveyCollection: Collection<Document>
  let surveyResultsCollection: Collection<Document>
  let accountCollection: Collection

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

  describe('save()', () => {
    it('Should save a survey result if its a new one', async () => {
      const account = await makeAccount(accountCollection)
      const survey = await makeSurvey(surveyCollection)
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
      const account = await makeAccount(accountCollection)
      const account2 = await makeAccount(accountCollection)
      const survey = await makeSurvey(surveyCollection)
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

  describe('loadBySurveyId()', () => {
    it('Should update the survey result', async () => {
      const account = await makeAccount(accountCollection)
      const account2 = await makeAccount(accountCollection)
      const account3 = await makeAccount(accountCollection)
      const account4 = await makeAccount(accountCollection)
      const survey = await makeSurvey(surveyCollection)
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
      const saveSurveyResultParams3: SaveSurveyResultParams = {
        ...saveSurveyResultParams,
        answer: survey.answers[1].answer,
        accountId: account3.id
      }
      const saveSurveyResultParams4: SaveSurveyResultParams = {
        ...saveSurveyResultParams,
        answer: survey.answers[1].answer,
        accountId: account4.id
      }

      await Promise.all([
        sut.save(saveSurveyResultParams),
        sut.save(saveSurveyResultParams2),
        sut.save(saveSurveyResultParams3),
        sut.save(saveSurveyResultParams4)
      ])

      const rersult = await sut.loadBySurveyId(survey.id as string, account2.id)

      expect(String(rersult.surveyId)).toBe(saveSurveyResultParams.surveyId)
      expect(rersult.answers[0].count).toBe(3)
      expect(rersult.answers[0].percent).toBe(75)
      expect(rersult.answers[1].count).toBe(1)
      expect(rersult.answers[1].percent).toBe(25)
    })
  })
})
