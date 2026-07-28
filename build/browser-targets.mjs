/*!
 * Browser floors for the Rolldown transform, derived from `.browserslistrc`.
 * Rolldown does not read browserslist, so we resolve the browser list here and
 * map it to the esbuild-style target strings that oxc understands.
 * Copyright 2026 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import browserslist from 'browserslist'

// oxc only accepts these engines. Chromium- and Gecko-based mobile browsers map
// onto their desktop equivalent, because they share the engine we transform for.
// Samsung Internet and Opera Mobile have no oxc target and are left out; both
// track Chromium releases above our Chrome floor.
// A Map keeps the browserslist IDs as plain strings, so their snake_case names
// do not fight the camelcase rule.
const OXC_TARGETS = new Map([
  ['chrome', 'chrome'],
  ['and_chr', 'chrome'],
  ['android', 'chrome'],
  ['edge', 'edge'],
  ['firefox', 'firefox'],
  ['and_ff', 'firefox'],
  ['safari', 'safari'],
  ['ios_saf', 'ios'],
  ['opera', 'opera']
])

const floors = new Map()

for (const entry of browserslist()) {
  // Browser names can hold a space, so split on the last one
  const index = entry.lastIndexOf(' ')
  const target = OXC_TARGETS.get(entry.slice(0, index))

  if (!target) {
    continue
  }

  // Skip non-numeric versions such as `TP`, and take the low end of a range
  // like `18.5-18.7`
  const version = Number.parseFloat(entry.slice(index + 1))

  if (Number.isNaN(version)) {
    continue
  }

  if (!floors.has(target) || version < floors.get(target)) {
    floors.set(target, version)
  }
}

export default [...floors].map(([target, version]) => `${target}${version}`)
