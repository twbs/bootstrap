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

      spyOn(DOMParser.prototype, 'parseFromString')

      const result = sanitizeHtml(template, DefaultAllowlist, mySanitize)

      expect(result).toEqual(template)
      expect(DOMParser.prototype.parseFromString).not.toHaveBeenCalled()
    })
  })
})
