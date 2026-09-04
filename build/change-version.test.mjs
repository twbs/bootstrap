import assert from 'node:assert/strict'
import { test } from 'node:test'

import { replaceDocsShortVersionLinks, shortVersion } from './change-version.mjs'

test('shortVersion returns the major and minor parts of a semver version', () => {
  assert.equal(shortVersion('5.3.8'), '5.3')
  assert.equal(shortVersion('v5.4.0'), '5.4')
})

test('replaceDocsShortVersionLinks updates current docs links only', () => {
  const input = `---
aliases:
  - /docs/5.3/components/navs/
  - /docs/4.6/components/navs/
---

See <a href="/docs/5.3/getting-started/introduction/">the docs</a>.
`

  assert.equal(
    replaceDocsShortVersionLinks(input, '5.3.8', '5.4.0'),
    `---
aliases:
  - /docs/5.4/components/navs/
  - /docs/4.6/components/navs/
---

See <a href="/docs/5.4/getting-started/introduction/">the docs</a>.
`
  )
})
