import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { makeRawAccountData } from '@src/shared/helpers/mocks'

const makeSut = () => new AccountMongoRepository()

describe('Account MongoDB Repository', () => {
  const sut = makeSut()
  let accountCollection: Collection<Document>

  const insertFakeAccount = async ({ name, email, password, role }: any) => {
    return accountCollection.insertOne({
      name,
      email,
      password,
      role
    })
  }

  beforeAll(async () => {
    await MongoHelper.connect()
    accountCollection = await MongoHelper.getCollection('accounts')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    it('Should return an account on add success', async () => {
      const account = await sut.add(makeRawAccountData())
      expect(account).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...makeRawAccountData()
        })
      )
    })
  })

  describe('loadByEmail()', () => {
    it('Should return an account on loadByEmail success', async () => {
      await insertFakeAccount(makeRawAccountData())
      const account = await sut.loadByEmail('valid_email@mail.com')
      expect(account).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...makeRawAccountData()
        })
      )
    })

    it('Should return undefined if loadByEmail fails', async () => {
      const account = await sut.loadByEmail('valid_email2@mail.com')
      expect(account).toBeUndefined()
    })
  })

  describe('updateAccessToken()', () => {
    it('Should update account access token on updateAccessToken success', async () => {
      const { insertedId: fakeAccountId } = await insertFakeAccount(
        makeRawAccountData()
      )
      const accountBefore = await accountCollection.findOne({
        _id: fakeAccountId
      })
      expect(accountBefore?.accessToken).toBeUndefined()
      await sut.updateAccessToken(fakeAccountId.toString(), 'any_token')
      const accountAfter = await accountCollection.findOne({
        _id: fakeAccountId
      })
      expect(accountAfter?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    const accessToken = 'any_token'

    it('Should return an account without role on loadByToken success', async () => {
      const { insertedId: fakeAccountId } = await insertFakeAccount({
        ...makeRawAccountData()
      })
      await sut.updateAccessToken(fakeAccountId.toString(), accessToken)
      const account = await sut.loadByToken(accessToken)
      expect(account).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...makeRawAccountData(),
          accessToken
        })
      )
    })

    it('Should return an account with admin role on loadByToken success', async () => {
      const { insertedId: fakeAccountId } = await insertFakeAccount({
        ...makeRawAccountData(),
        accessToken,
        role: 'admin'
      })
      await sut.updateAccessToken(fakeAccountId.toString(), accessToken)
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...makeRawAccountData(),
          accessToken,
          role: 'admin'
        })
      )
    })

    it('Should return an account on loadByToken if user is admin', async () => {
      const { insertedId: fakeAccountId } = await insertFakeAccount({
        ...makeRawAccountData(),
        accessToken,
        role: 'admin'
      })
      await sut.updateAccessToken(fakeAccountId.toString(), accessToken)
      const account = await sut.loadByToken(accessToken)
      expect(account).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          ...makeRawAccountData(),
          accessToken,
          role: 'admin'
        })
      )
    })

    it('Should return undefined whe no account found by token', async () => {
      const account = await sut.loadByToken('invalid_token')
      expect(account).toBeUndefined()
    })

    it('Should return undefined when invalid role', async () => {
      await insertFakeAccount({
        ...makeRawAccountData(),
        accessToken
      })
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeUndefined()
    })
  })
})
