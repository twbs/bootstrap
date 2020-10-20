import FileInput from '../../src/file-input'

/** Test helpers */
import { getFixture, clearFixture, jQueryMock, mockFileApi } from '../helpers/fixture'

describe('FileInput', () => {
  // TODO
  const isEdge = window.navigator.userAgent.indexOf('Edge') > -1

  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should return version', () => {
    expect(typeof FileInput.VERSION).toEqual('string')
  })

  describe('data-api', () => {
    it('should handle change on input', done => {
      if (isEdge) {
        expect().nothing()
        return done()
      }

      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const input = fixtureEl.querySelector('input')
      const formFileNode = fixtureEl.querySelector('.form-file')
      const label = fixtureEl.querySelector('.form-file-text')

      input.click()

      expect(FileInput.getInstance(formFileNode)).toBeDefined()

      input.addEventListener('change', () => {
        expect(label.textContent).toEqual(input.value)

        done()
      })

      Object.defineProperty(input, 'value', {
        value: 'myFakeFile.exe'
      })

      input.dispatchEvent(new Event('change'))
    })

    it('should not recreate a new file input', () => {
      if (isEdge) {
        return expect().nothing()
      }

      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const input = fixtureEl.querySelector('input')
      const formFileNode = fixtureEl.querySelector('.form-file')

      input.click()

      const instance = FileInput.getInstance(formFileNode)

      expect(instance).toBeDefined()

      input.click()

      expect(instance).toEqual(FileInput.getInstance(formFileNode))
    })

    it('should restore default text if value is empty', done => {
      if (isEdge) {
        expect().nothing()
        return done()
      }

      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const input = fixtureEl.querySelector('input')
      const label = fixtureEl.querySelector('.form-file-text')

      input.click()

      const firstListener = () => {
        expect(label.textContent).toEqual('myFakeFile.exe')
        input.removeEventListener('change', firstListener)
        input.addEventListener('change', secondListener)

        input.value = ''
        input.dispatchEvent(new Event('change'))
      }

      const secondListener = () => {
        expect(label.textContent).toEqual('Choose file...')
        input.removeEventListener('change', secondListener)
        done()
      }

      input.addEventListener('change', firstListener)

      Object.defineProperty(input, 'value', {
        value: 'myFakeFile.exe',
        configurable: true,
        writable: true
      })

      input.dispatchEvent(new Event('change'))
    })

    it('should remove fake path', done => {
      if (isEdge) {
        expect().nothing()
        return done()
      }

      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const input = fixtureEl.querySelector('input')
      const label = fixtureEl.querySelector('.form-file-text')

      input.click()

      input.addEventListener('change', () => {
        expect(label.textContent).toEqual('myFakeFile.exe')

        done()
      })

      Object.defineProperty(input, 'value', {
        value: 'C:\\fakepath\\myFakeFile.exe'
      })

      input.dispatchEvent(new Event('change'))
    })

    it('should handle change when multiple files are added', done => {
      if (isEdge) {
        expect().nothing()
        return done()
      }

      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile" multiple>',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose files...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const input = fixtureEl.querySelector('input')
      const label = fixtureEl.querySelector('.form-file-text')

      input.click()

      input.addEventListener('change', () => {
        expect(label.textContent).toEqual('myFakeFile.exe, fakeImage.png')

        done()
      })

      Object.defineProperty(input, 'files', {
        value: [
          mockFileApi([], 'myFakeFile.exe'),
          mockFileApi([], 'fakeImage.png')
        ]
      })

      input.dispatchEvent(new Event('change'))
    })

    it('should handle form reset', done => {
      if (isEdge) {
        expect().nothing()
        return done()
      }

      fixtureEl.innerHTML = [
        '<form>',
        '  <div class="form-file" data-toggle="file-input">',
        '    <input type="file" class="form-file-input" id="customFile">',
        '    <label class="form-file-label" for="customFile">',
        '      <span class="form-file-text">Choose file...</span>',
        '    </label>',
        '  </div>',
        '</form>'
      ].join('')

      const form = fixtureEl.querySelector('form')
      const input = fixtureEl.querySelector('input')
      const label = fixtureEl.querySelector('.form-file-text')

      input.click()

      input.addEventListener('change', () => {
        expect(label.textContent).toEqual(input.value)

        form.dispatchEvent(new Event('reset'))
      })

      form.addEventListener('reset', () => {
        expect(label.textContent).toEqual('Choose file...')
        done()
      })

      Object.defineProperty(input, 'value', {
        value: 'myFakeFile.exe'
      })

      input.dispatchEvent(new Event('change'))
    })
  })

  describe('dispose', () => {
    it('should dispose an alert', () => {
      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const formFileNode = fixtureEl.querySelector('.form-file')
      const fileInput = new FileInput(formFileNode)

      expect(FileInput.getInstance(formFileNode)).toBeDefined()

      fileInput.dispose()

      expect(FileInput.getInstance(formFileNode)).toBeNull()
    })
  })

  describe('restoreDefaultText', () => {
    it('should restore default text', () => {
      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const expectedText = 'Choose file...'
      const changedText = 'Choose one file...'
      const formFileNode = fixtureEl.querySelector('.form-file')
      const formFileLabel = fixtureEl.querySelector('.form-file-text')
      const fileInput = new FileInput(formFileNode)
      formFileLabel.textContent = changedText

      expect(formFileLabel.textContent).toEqual(changedText)

      fileInput.restoreDefaultText()

      expect(formFileLabel.textContent).toEqual(expectedText)
    })
  })

  describe('jQueryInterface', () => {
    it('should just create a file input instance', () => {
      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const formFileNode = fixtureEl.querySelector('.form-file')

      jQueryMock.fn.fileInput = FileInput.jQueryInterface
      jQueryMock.elements = [formFileNode]

      jQueryMock.fn.fileInput.call(jQueryMock)

      expect(FileInput.getInstance(formFileNode)).toBeDefined()
    })

    it('should not create another file input instance', () => {
      fixtureEl.innerHTML = [
        '<div class="form-file" data-toggle="file-input">',
        '  <input type="file" class="form-file-input" id="customFile">',
        '  <label class="form-file-label" for="customFile">',
        '    <span class="form-file-text">Choose file...</span>',
        '  </label>',
        '</div>'
      ].join('')

      const formFileNode = fixtureEl.querySelector('.form-file')
      const fileInput = new FileInput(formFileNode)

      jQueryMock.fn.fileInput = FileInput.jQueryInterface
      jQueryMock.elements = [formFileNode]

      jQueryMock.fn.fileInput.call(jQueryMock)

      expect(FileInput.getInstance(formFileNode)).toBeDefined()
      expect(FileInput.getInstance(formFileNode)).toEqual(fileInput)
    })
  })
})
