import { DefaultAllowlist, sanitizeHtml } from '../../../src/util/sanitizer.js'

describe('Sanitizer', () => {
  describe('sanitizeHtml', () => {
    it('should return the same on empty string', () => {
      const empty = ''

      const result = sanitizeHtml(empty, DefaultAllowlist, null)

      expect(result).toEqual(empty)
    })

    it('should retain tags with valid URLs', () => {
      const validUrls = [
        '',
        'http://abc',
        'HTTP://abc',
        'https://abc',
        'HTTPS://abc',
        'ftp://abc',
        'FTP://abc',
        'mailto:me@example.com',
        'MAILTO:me@example.com',
        'tel:123-123-1234',
        'TEL:123-123-1234',
        'sip:me@example.com',
        'SIP:me@example.com',
        '#anchor',
        '/page1.md',
        'http://JavaScript/my.js',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/', // Truncated.
        'data:video/webm;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
        'data:audio/opus;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/',
        'unknown-scheme:abc'
      ]

      for (const url of validUrls) {
        const template = [
          '<div>',
          `  <a href="${url}">Click me</a>`,
          '  <span>Some content</span>',
          '</div>'
        ].join('')

        const result = sanitizeHtml(template, DefaultAllowlist, null)

        expect(result).toContain(`href="${url}"`)
      }
    })

    it('should sanitize template by removing tags with XSS', () => {
      const invalidUrls = [
        // eslint-disable-next-line no-script-url
        'javascript:alert(7)',
        // eslint-disable-next-line no-script-url
        'javascript:evil()',
        // eslint-disable-next-line no-script-url
        'JavaScript:abc',
        ' javascript:abc',
        ' \n Java\n Script:abc',
        '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
        '&#106&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
        '&#106 &#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;',
        '&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058',
        '&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A;',
        'jav&#x09;ascript:alert();',
        'jav\u0000ascript:alert();'
      ]

      for (const url of invalidUrls) {
        const template = [
          '<div>',
          `  <a href="${url}">Click me</a>`,
          '  <span>Some content</span>',
          '</div>'
        ].join('')

        const result = sanitizeHtml(template, DefaultAllowlist, null)

        expect(result).not.toContain(`href="${url}"`)
      }
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
