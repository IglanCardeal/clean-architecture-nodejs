import { AddSurveyModel } from '@src/domain/usecases/add-survey'
import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSut = () => new SurveyMongoRepository()
const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ]
})

describe('Account MongoDB Repository', () => {
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

  it('Should save a survey on add success', async () => {
    await sut.add(makeFakeSurveyData())
    const surveySaved = await surveyCollection.findOne({
      question: 'any_question'
    })
    expect(surveySaved).toMatchObject({
      ...makeFakeSurveyData()
    })
  })
})
