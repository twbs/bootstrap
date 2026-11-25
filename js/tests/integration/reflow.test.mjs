import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { minify } from 'terser'

test('reflow still forces layout after minification with pure getters', async t => {
  const source = await readFile(new URL('../../src/util/index.js', import.meta.url), 'utf8')
  const { code } = await minify(source, {
    module: true,
    compress: { passes: 2, pure_getters: true } // eslint-disable-line camelcase
  })

  const { reflow } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
  const getBoundingClientRect = t.mock.fn()

  reflow({ getBoundingClientRect })

  assert.equal(getBoundingClientRect.mock.callCount(), 1)
})
