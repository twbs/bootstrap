import Data from '../../../src/dom/data'
import { getFixture, clearFixture } from '../../helpers/fixture'

describe('Data', () => {
  const TEST_KEY = 'bs.test'
  const UNKNOWN_KEY = 'bs.unknown'
  const TEST_DATA = {
    test: 'bsData'
  }

  let fixtureEl
  let div

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  beforeEach(() => {
    fixtureEl.innerHTML = '<div></div>'
    div = fixtureEl.querySelector('div')
  })

  afterEach(() => {
    Data.remove(div, TEST_KEY)
    clearFixture()
  })

  it('should return null for unknown elements', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)

    expect(Data.get(null)).toBeNull()
    expect(Data.get(undefined)).toBeNull()
    expect(Data.get(document.createElement('div'), TEST_KEY)).toBeNull()
  })

  it('should return null for unknown keys', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)

    expect(Data.get(div, null)).toBeNull()
    expect(Data.get(div, undefined)).toBeNull()
    expect(Data.get(div, UNKNOWN_KEY)).toBeNull()
  })

  it('should store data for an element with a given key and return it', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)

    expect(Data.get(div, TEST_KEY)).toEqual(data)
  })

  it('should do nothing when an element has nothing stored', () => {
    Data.remove(div, TEST_KEY)

    expect().nothing()
  })

  it('should remove nothing for an unknown key', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)
    Data.remove(div, UNKNOWN_KEY)

    expect(Data.get(div, TEST_KEY)).toEqual(data)
  })

  it('should remove data for a given key', () => {
    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)
    Data.remove(div, TEST_KEY)

    expect(Data.get(div, TEST_KEY)).toBeNull()
  })

  /* eslint-disable no-console */
  it('should console.error a message if called with multiple keys', () => {
    console.error = jasmine.createSpy('console.error')

    const data = { ...TEST_DATA }
    const copy = { ...data }

    Data.set(div, TEST_KEY, data)
    Data.set(div, UNKNOWN_KEY, copy)

    expect(console.error).toHaveBeenCalledWith(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${TEST_KEY}.`)
    expect(Data.get(div, UNKNOWN_KEY)).toBeNull()
  })

  it('should console.error a message if "set" is for the same element', () => {
    console.error = jasmine.createSpy('console.error')

    const data = { ...TEST_DATA }

    Data.set(div, TEST_KEY, data)
    Data.set(div, TEST_KEY, data)

    expect(console.error).toHaveBeenCalledWith(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${TEST_KEY}.`)
    expect(Data.get(div, TEST_KEY)).toEqual(data)
  })
  /* eslint-enable no-console */
})
