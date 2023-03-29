import TemplateFactory from '../../../src/util/template-factory.js'
import { clearFixture, getFixture } from '../../helpers/fixture.js'

describe('TemplateFactory', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('NAME', () => {
    it('should return plugin NAME', () => {
      expect(TemplateFactory.NAME).toEqual('TemplateFactory')
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(TemplateFactory.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('toHtml', () => {
    describe('Sanitization', () => {
      it('should use "sanitizeHtml" to sanitize template', () => {
        const factory = new TemplateFactory({
          sanitize: true,
          template: '<div><a href="javascript:alert(7)">Click me</a></div>'
        })
        const spy = spyOn(factory, '_maybeSanitize').and.callThrough()

        expect(factory.toHtml().innerHTML).not.toContain('href="javascript:alert(7)')
        expect(spy).toHaveBeenCalled()
      })

      it('should not sanitize template', () => {
        const factory = new TemplateFactory({
          sanitize: false,
          template: '<div><a href="javascript:alert(7)">Click me</a></div>'
        })
        const spy = spyOn(factory, '_maybeSanitize').and.callThrough()

        expect(factory.toHtml().innerHTML).toContain('href="javascript:alert(7)')
        expect(spy).toHaveBeenCalled()
      })

      it('should use "sanitizeHtml" to sanitize content', () => {
        const factory = new TemplateFactory({
          sanitize: true,
          html: true,
          template: '<div id="foo"></div>',
          content: { '#foo': '<a href="javascript:alert(7)">Click me</a>' }
        })
        expect(factory.toHtml().innerHTML).not.toContain('href="javascript:alert(7)')
      })

      it('should not sanitize content', () => {
        const factory = new TemplateFactory({
          sanitize: false,
          html: true,
          template: '<div id="foo"></div>',
          content: { '#foo': '<a href="javascript:alert(7)">Click me</a>' }
        })
        expect(factory.toHtml().innerHTML).toContain('href="javascript:alert(7)')
      })

      it('should sanitize content only if "config.html" is enabled', () => {
        const factory = new TemplateFactory({
          sanitize: true,
          html: false,
          template: '<div id="foo"></div>',
          content: { '#foo': '<a href="javascript:alert(7)">Click me</a>' }
        })
        const spy = spyOn(factory, '_maybeSanitize').and.callThrough()

        expect(spy).not.toHaveBeenCalled()
      })
    })

    describe('Extra Class', () => {
      it('should add extra class', () => {
        const factory = new TemplateFactory({
          extraClass: 'testClass'
        })
        expect(factory.toHtml()).toHaveClass('testClass')
      })

      it('should add extra classes', () => {
        const factory = new TemplateFactory({
          extraClass: 'testClass testClass2'
        })
        expect(factory.toHtml()).toHaveClass('testClass')
        expect(factory.toHtml()).toHaveClass('testClass2')
      })

      it('should resolve class if function is given', () => {
        const factory = new TemplateFactory({
          extraClass(arg) {
            expect(arg).toEqual(factory)
            return 'testClass'
          }
        })

        expect(factory.toHtml()).toHaveClass('testClass')
      })
    })
  })

  describe('Content', () => {
    it('add simple text content', () => {
      const template = [
        '<div>',
        '  <div class="foo"></div>',
        '  <div class="foo2"></div>',
        '</div>'
      ].join('')

      const factory = new TemplateFactory({
        template,
        content: {
          '.foo': 'bar',
          '.foo2': 'bar2'
        }
      })

      const html = factory.toHtml()
      expect(html.querySelector('.foo').textContent).toEqual('bar')
      expect(html.querySelector('.foo2').textContent).toEqual('bar2')
    })

    it('should not fill template if selector not exists', () => {
      const factory = new TemplateFactory({
        sanitize: true,
        html: true,
        template: '<div id="foo"></div>',
        content: { '#bar': 'test' }
      })

      expect(factory.toHtml().outerHTML).toEqual('<div id="foo"></div>')
    })

    it('should remove template selector, if content is null', () => {
      const factory = new TemplateFactory({
        sanitize: true,
        html: true,
        template: '<div><div id="foo"></div></div>',
        content: { '#foo': null }
      })

      expect(factory.toHtml().outerHTML).toEqual('<div></div>')
    })

    it('should resolve content if is function', () => {
      const factory = new TemplateFactory({
        sanitize: true,
        html: true,
        template: '<div><div id="foo"></div></div>',
        content: { '#foo': () => null }
      })

      expect(factory.toHtml().outerHTML).toEqual('<div></div>')
    })

    it('if content is element and "config.html=false", should put content\'s textContent', () => {
      fixtureEl.innerHTML = '<div>foo<span>bar</span></div>'
      const contentElement = fixtureEl.querySelector('div')

      const factory = new TemplateFactory({
        html: false,
        template: '<div><div id="foo"></div></div>',
        content: { '#foo': contentElement }
      })

      const fooEl = factory.toHtml().querySelector('#foo')
      expect(fooEl.innerHTML).not.toEqual(contentElement.innerHTML)
      expect(fooEl.textContent).toEqual(contentElement.textContent)
      expect(fooEl.textContent).toEqual('foobar')
    })

    it('if content is element and "config.html=true", should put content\'s outerHtml as child', () => {
      fixtureEl.innerHTML = '<div>foo<span>bar</span></div>'
      const contentElement = fixtureEl.querySelector('div')

      const factory = new TemplateFactory({
        html: true,
        template: '<div><div id="foo"></div></div>',
        content: { '#foo': contentElement }
      })

      const fooEl = factory.toHtml().querySelector('#foo')
      expect(fooEl.innerHTML).toEqual(contentElement.outerHTML)
      expect(fooEl.textContent).toEqual(contentElement.textContent)
    })
  })

  describe('getContent', () => {
    it('should get content as array', () => {
      const factory = new TemplateFactory({
        content: {
          '.foo': 'bar',
          '.foo2': 'bar2'
        }
      })
      expect(factory.getContent()).toEqual(['bar', 'bar2'])
    })

    it('should filter empties', () => {
      const factory = new TemplateFactory({
        content: {
          '.foo': 'bar',
          '.foo2': '',
          '.foo3': null,
          '.foo4': () => 2,
          '.foo5': () => null
        }
      })
      expect(factory.getContent()).toEqual(['bar', 2])
    })
  })

  describe('hasContent', () => {
    it('should return true, if it has', () => {
      const factory = new TemplateFactory({
        content: {
          '.foo': 'bar',
          '.foo2': 'bar2',
          '.foo3': ''
        }
      })
      expect(factory.hasContent()).toBeTrue()
    })

    it('should return false, if filtered content is empty', () => {
      const factory = new TemplateFactory({
        content: {
          '.foo2': '',
          '.foo3': null,
          '.foo4': () => null
        }
      })
      expect(factory.hasContent()).toBeFalse()
    })
  })

  describe('changeContent', () => {
    it('should change Content', () => {
      const template = [
        '<div>',
        '  <div class="foo"></div>',
        '  <div class="foo2"></div>',
        '</div>'
      ].join('')

      const factory = new TemplateFactory({
        template,
        content: {
          '.foo': 'bar',
          '.foo2': 'bar2'
        }
      })

      const html = selector => factory.toHtml().querySelector(selector).textContent
      expect(html('.foo')).toEqual('bar')
      expect(html('.foo2')).toEqual('bar2')
      factory.changeContent({
        '.foo': 'test',
        '.foo2': 'test2'
      })

      expect(html('.foo')).toEqual('test')
      expect(html('.foo2')).toEqual('test2')
    })

    it('should change only the given, content', () => {
      const template = [
        '<div>',
        '  <div class="foo"></div>',
        '  <div class="foo2"></div>',
        '</div>'
      ].join('')

      const factory = new TemplateFactory({
        template,
        content: {
          '.foo': 'bar',
          '.foo2': 'bar2'
        }
      })

      const html = selector => factory.toHtml().querySelector(selector).textContent
      expect(html('.foo')).toEqual('bar')
      expect(html('.foo2')).toEqual('bar2')
      factory.changeContent({
        '.foo': 'test',
        '.wrong': 'wrong'
      })

      expect(html('.foo')).toEqual('test')
      expect(html('.foo2')).toEqual('bar2')
    })
  })
})
