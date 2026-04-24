import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { sortClasses, classKey, CLASS_ORDER, BREAKPOINTS } from '../src/class-order.mjs'

describe('classKey', () => {
  it('returns a finite category index for known Bootstrap classes', () => {
    const knownClasses = ['container', 'row', 'col', 'btn', 'd-flex', 'm-3', 'p-2', 'text-center']
    for (const cls of knownClasses) {
      const [catIdx] = classKey(cls)
      assert.notStrictEqual(catIdx, Infinity, `${cls} should be recognized`)
    }
  })

  it('returns Infinity for unknown classes', () => {
    const [catIdx] = classKey('acme-widget')
    assert.strictEqual(catIdx, Infinity)
  })

  it('returns breakpoint index 0 for base classes', () => {
    const [, bpIdx] = classKey('d-flex')
    assert.strictEqual(bpIdx, 0)
  })

  it('extracts responsive infix correctly', () => {
    const [catIdx, bpIdx] = classKey('d-md-flex')
    assert.notStrictEqual(catIdx, Infinity, 'd-md-flex should match d- prefix')
    assert.strictEqual(bpIdx, BREAKPOINTS.indexOf('md') + 1)
  })

  it('handles all breakpoint sizes', () => {
    for (const [i, bp] of BREAKPOINTS.entries()) {
      const [, bpIdx] = classKey(`d-${bp}-flex`)
      assert.strictEqual(bpIdx, i + 1, `d-${bp}-flex should have breakpoint index ${i + 1}`)
    }
  })

  it('matches exact prefixes over shorter ones', () => {
    // "container-fluid" should match the exact entry, not just "container"
    const [fluidIdx] = classKey('container-fluid')
    const [containerIdx] = classKey('container')
    assert.ok(fluidIdx < containerIdx, 'container-fluid should sort before container')
  })
})

describe('sortClasses', () => {
  it('returns single-element arrays unchanged', () => {
    assert.deepStrictEqual(sortClasses(['btn']), ['btn'])
  })

  it('sorts layout before components', () => {
    const sorted = sortClasses(['btn', 'container', 'row'])
    const containerIdx = sorted.indexOf('container')
    const rowIdx = sorted.indexOf('row')
    const btnIdx = sorted.indexOf('btn')
    assert.ok(containerIdx < btnIdx, 'container should come before btn')
    assert.ok(rowIdx < btnIdx, 'row should come before btn')
  })

  it('sorts components before utilities', () => {
    const sorted = sortClasses(['d-flex', 'btn', 'p-3'])
    const btnIdx = sorted.indexOf('btn')
    const dFlexIdx = sorted.indexOf('d-flex')
    const p3Idx = sorted.indexOf('p-3')
    assert.ok(btnIdx < dFlexIdx, 'btn should come before d-flex')
    assert.ok(btnIdx < p3Idx, 'btn should come before p-3')
  })

  it('sorts utilities in _utilities.scss order', () => {
    // display → shadow → border → sizing → flex → spacing → text → bg → rounded
    const classes = ['rounded', 'bg-primary', 'text-center', 'p-3', 'm-2', 'd-flex', 'border', 'shadow', 'w-100']
    const sorted = sortClasses(classes)

    const indexOf = (cls) => sorted.indexOf(cls)

    assert.ok(indexOf('d-flex') < indexOf('shadow'), 'd- before shadow')
    assert.ok(indexOf('shadow') < indexOf('border'), 'shadow before border')
    assert.ok(indexOf('border') < indexOf('w-100'), 'border before w-')
    assert.ok(indexOf('w-100') < indexOf('m-2'), 'w- before m-')
    assert.ok(indexOf('m-2') < indexOf('p-3'), 'm- before p-')
    assert.ok(indexOf('p-3') < indexOf('text-center'), 'p- before text-')
    assert.ok(indexOf('bg-primary') < indexOf('rounded'), 'bg- before rounded')
  })

  it('sorts responsive variants after base class', () => {
    const sorted = sortClasses(['d-md-flex', 'd-flex', 'd-lg-none'])
    assert.deepStrictEqual(sorted, ['d-flex', 'd-md-flex', 'd-lg-none'])
  })

  it('preserves order of unknown classes', () => {
    const sorted = sortClasses(['acme-b', 'acme-a', 'btn'])
    const btnIdx = sorted.indexOf('btn')
    const customAIdx = sorted.indexOf('acme-a')
    const customBIdx = sorted.indexOf('acme-b')
    assert.ok(btnIdx < customBIdx, 'known classes come before unknown')
    assert.ok(customBIdx < customAIdx, 'unknown classes preserve relative order')
  })

  it('handles a realistic Bootstrap class list', () => {
    const input = ['text-center', 'p-3', 'container', 'bg-primary', 'text-white', 'mb-4', 'rounded']
    const sorted = sortClasses(input)

    // container first (layout), then utilities in _utilities.scss order
    assert.strictEqual(sorted[0], 'container')
    // All should be present
    assert.strictEqual(sorted.length, input.length)
    for (const cls of input) {
      assert.ok(sorted.includes(cls), `${cls} should be in sorted output`)
    }
  })

  it('handles mixed component and utility classes', () => {
    const input = ['mt-3', 'card', 'shadow-sm', 'card-body', 'p-4']
    const sorted = sortClasses(input)
    const cardIdx = sorted.indexOf('card')
    const cardBodyIdx = sorted.indexOf('card-body')
    const mt3Idx = sorted.indexOf('mt-3')

    assert.ok(cardIdx < mt3Idx, 'card (component) before mt-3 (utility)')
    assert.ok(cardBodyIdx < mt3Idx, 'card-body (component) before mt-3 (utility)')
  })

  it('handles spacing utility ordering (margin before padding)', () => {
    const sorted = sortClasses(['p-3', 'm-2', 'py-1', 'mx-auto'])
    const m2Idx = sorted.indexOf('m-2')
    const mxIdx = sorted.indexOf('mx-auto')
    const p3Idx = sorted.indexOf('p-3')
    const py1Idx = sorted.indexOf('py-1')

    assert.ok(m2Idx < p3Idx, 'm- before p-')
    assert.ok(mxIdx < py1Idx, 'mx- before py-')
  })
})

describe('CLASS_ORDER', () => {
  it('has no duplicate entries', () => {
    const seen = new Set()
    for (const entry of CLASS_ORDER) {
      assert.ok(!seen.has(entry), `duplicate entry: ${entry}`)
      seen.add(entry)
    }
  })

  it('starts with layout classes', () => {
    assert.ok(CLASS_ORDER[0].startsWith('container'), 'first entry should be container-related')
  })
})
