/*!
 * Assertions on the compiled reboot CSS that sass-true module tests cannot
 * express: the `small` element must use the defined font-size token, not a
 * custom property that is never set.
 */

'use strict'

const path = require('node:path')
const sass = require('sass')

describe('reboot small font size', () => {
  it('uses the defined --font-size-sm token', () => {
    const scssPath = path.resolve(__dirname, '../../content/_reboot.scss')
    const { css } = sass.compile(scssPath)
    const smallRule = css.match(/small,\s*\.small\s*\{([^}]*)\}/)
    expect(smallRule).not.toBeNull()
    expect(smallRule[1]).toContain('font-size: var(--font-size-sm)')
    expect(smallRule[1]).not.toContain('--small-font-size')
  })
})
