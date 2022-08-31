import { DefaultAllowlist, sanitizeHtml } from '../../../src/util/sanitizer'

describe('Sanitizer', () => {
  describe('sanitizeHtml', () => {
    it('should return the same on empty string', () => {
      const empty = ''

      const result = sanitizeHtml(empty, DefaultAllowlist, null)

      expect(result).toEqual(empty)
    })

    it('should sanitize template by removing tags with XSS', () => {
      const template = [
        '<div>',
        '  <a href="javascript:alert(7)">Click me</a>',
        '  <span>Some content</span>',
        '</div>'
      ].join('')

      const result = sanitizeHtml(template, DefaultAllowlist, null)

      expect(result).not.toContain('href="javascript:alert(7)')
    })

    it('should sanitize template and work with multiple regex', () => {
      const template = [
        '<div>',
        '  <a href="javascript:alert(7)" aria-label="This is a link" data-foo="bar">Click me</a>',
        '  <span>Some content</span>',
        '</div>'
      ].join('')

      const myDefaultAllowList = DefaultAllowlist
      // With the default allow list
      let result = sanitizeHtml(template, myDefaultAllowList, null)

      // `data-foo` won't be present
      expect(result).not.toContain('data-foo="bar"')

      // Add the following regex too
      myDefaultAllowList['*'].push(/^data-foo/)

      result = sanitizeHtml(template, myDefaultAllowList, null)

      expect(result).not.toContain('href="javascript:alert(7)') // This is in the default list
      expect(result).toContain('aria-label="This is a link"') // This is in the default list
      expect(result).toContain('data-foo="bar"') // We explicitly allow this
    })

    it('should allow aria attributes and safe attributes', () => {
      const template = [
        '<div aria-pressed="true">',
        '  <span class="test">Some content</span>',
        '</div>'
      ].join('')

      const result = sanitizeHtml(template, DefaultAllowlist, null)

      expect(result).toContain('aria-pressed')
      expect(result).toContain('class="test"')
    })

    it('should remove tags not in allowlist', () => {
      const template = [
        '<div>',
        '  <script>alert(7)</script>',
        '</div>'
      ].join('')

      const result = sanitizeHtml(template, DefaultAllowlist, null)

      expect(result).not.toContain('<script>')
    })

    it('should not use native api to sanitize if a custom function passed', () => {
      const template = [
        '<div>',
        '  <span>Some content</span>',
        '</div>'
      ].join('')

      function mySanitize(htmlUnsafe) {
        return htmlUnsafe
      }

      const spy = spyOn(DOMParser.prototype, 'parseFromString')

      const result = sanitizeHtml(template, DefaultAllowlist, mySanitize)

      expect(result).toEqual(template)
      expect(spy).not.toHaveBeenCalled()
    })

    it('should allow multiple sanitation passes of the same template', () => {
      const template = '<img src="test.jpg">'

      const firstResult = sanitizeHtml(template, DefaultAllowlist, null)
      const secondResult = sanitizeHtml(template, DefaultAllowlist, null)

      expect(firstResult).toContain('src')
      expect(secondResult).toContain('src')
    })
  })
})
