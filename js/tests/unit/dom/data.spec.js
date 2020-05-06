import Data from '../../../src/dom/data'

/** Test helpers */
import { getFixture, clearFixture } from '../../helpers/fixture'

describe('Data', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('setData', () => {
    it('should set data in an element by adding a bsKey attribute', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data = {
        test: 'bsData'
      }

      Data.setData(div, 'test', data)
      expect(div.bsKey).toBeDefined()
    })

    it('should change data if something is already stored', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data = {
        test: 'bsData'
      }

      Data.setData(div, 'test', data)

      data.test = 'bsData2'
      Data.setData(div, 'test', data)

      expect(div.bsKey).toBeDefined()
    })
  })

  describe('getData', () => {
    it('should return stored data', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data = {
        test: 'bsData'
      }

      Data.setData(div, 'test', data)
      expect(Data.getData(div, 'test')).toEqual(data)
    })

    it('should return different stored data for multiple keys', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data1 = {
        test: 'bsData1'
      }
      const data2 = {
        test: 'bsData2'
      }

      Data.setData(div, 'test1', data1)
      Data.setData(div, 'test2', data2)
      expect(Data.getData(div, 'test1')).toEqual(data1)
      expect(Data.getData(div, 'test2')).toEqual(data2)
    })

    it('should return null on undefined element', () => {
      expect(Data.getData(null)).toEqual(null)
      expect(Data.getData(undefined)).toEqual(null)
    })

    it('should return null when an element have nothing stored', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      expect(Data.getData(div, 'test')).toEqual(null)
    })

    it('should return null when an element have nothing stored with the provided key', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data = {
        test: 'bsData'
      }

      Data.setData(div, 'test', data)

      expect(Data.getData(div, 'test2')).toEqual(null)
    })
  })

  describe('removeData', () => {
    it('should do nothing when an element have nothing stored', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')

      Data.removeData(div, 'test')
      expect().nothing()
    })

    it('should should do nothing if it\'s not a valid key provided', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data = {
        test: 'bsData'
      }

      Data.setData(div, 'test', data)

      expect(div.bsKey.test).toBeDefined()

      Data.removeData(div, 'test2')

      expect(div.bsKey.test).toBeDefined()
    })

    it('should remove data if something is stored', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data = {
        test: 'bsData'
      }

      Data.setData(div, 'test', data)

      expect(div.bsKey.test).toBeDefined()

      Data.removeData(div, 'test')

      expect(div.bsKey.test).toBeUndefined()
    })

    it('should only remove the specified data', () => {
      fixtureEl.innerHTML = '<div></div>'

      const div = fixtureEl.querySelector('div')
      const data1 = {
        test: 'bsData1'
      }
      const data2 = {
        test: 'bsData2'
      }

      Data.setData(div, 'test1', data1)
      Data.setData(div, 'test2', data2)

      expect(div.bsKey.test1).toBeDefined()
      expect(div.bsKey.test2).toBeDefined()

      Data.removeData(div, 'test1')

      expect(div.bsKey.test1).toBeUndefined()
      expect(div.bsKey.test2).toBeDefined()
    })
  })
})
