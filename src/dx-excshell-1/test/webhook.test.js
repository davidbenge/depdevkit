/*
* <license header>
*/

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn()
  }
}))

const { Core } = require('@adobe/aio-sdk')
const mockLoggerInstance = { info: jest.fn(), debug: jest.fn(), error: jest.fn() }
Core.Logger.mockReturnValue(mockLoggerInstance)

jest.mock('node-fetch')
const fetch = require('node-fetch')
const action = require('./../actions/webhook/index.js')

beforeEach(() => {
  Core.Logger.mockClear()
  mockLoggerInstance.info.mockReset()
  mockLoggerInstance.debug.mockReset()
  mockLoggerInstance.error.mockReset()
})

const fakeParams = { __ow_headers: { authorization: 'Bearer fake' }, LOG_LEVEL: 'info' }
describe('webhook', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function)
  })
  test('should set logger to use LOG_LEVEL param', async () => {
    await action.main({ ...fakeParams, LOG_LEVEL: 'fakeLevel' })
    expect(Core.Logger).toHaveBeenCalledWith(expect.any(String), { level: 'fakeLevel' })
  })
  test('should return an http challenge reponse with challenge', async () => {
    const mockFetchResponse = {
      ok: true,
      json: () => Promise.resolve({ challenge: 'fake_challenge_phrase' })
    }
    fetch.mockResolvedValue(mockFetchResponse)
    let mergedParams = { ...fakeParams, body: { challenge: 'fake_challenge_phrase' } }
    //console.log(mergedParams)
    const response = await action.main(mergedParams)
    //console.log(response)
    expect(response).toEqual({
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { challenge: 'fake_challenge_phrase' }
    })
  })
})