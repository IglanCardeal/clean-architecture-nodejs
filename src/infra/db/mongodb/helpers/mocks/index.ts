import { SurveyModel } from '@src/domain/models/survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../mongo/mongo-helper'

export const makeSurvey = async (
  surveyCollection: Collection
): Promise<SurveyModel> => {
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

export const makeAccount = async (
  accountCollection: Collection
): Promise<{ id: string }> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password'
  })

  return { id: MongoHelper.mapDocumentIdToString({ _id: res.insertedId }) }
}
