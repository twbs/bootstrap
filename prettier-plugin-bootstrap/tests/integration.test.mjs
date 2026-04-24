import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// Test the sortClassString helper via the exported sortClasses
import { sortClasses } from '../src/class-order.mjs'

describe('sortClassString integration', () => {
  it('handles a typical Bootstrap HTML class attribute value', () => {
    // A common pattern: mixing utilities and components
    const input = 'text-center p-3 container bg-primary text-white mb-4 rounded'
    const classes = input.split(/\s+/)
    const sorted = sortClasses(classes)
    const result = sorted.join(' ')

    // container (layout) should be first
    assert.ok(result.startsWith('container'), `should start with container, got: ${result}`)
    // rounded should be near the end (border-radius utility)
    assert.ok(result.endsWith('rounded'), `should end with rounded, got: ${result}`)
  })

  it('handles Bootstrap card example', () => {
    // From Bootstrap docs: a card with image
    const input = 'shadow-sm card mb-3 border-0'
    const sorted = sortClasses(input.split(/\s+/))
    const result = sorted.join(' ')

    // card (component) should come before utilities
    const cardIdx = sorted.indexOf('card')
    const shadowIdx = sorted.indexOf('shadow-sm')
    const mb3Idx = sorted.indexOf('mb-3')
    const borderIdx = sorted.indexOf('border-0')

    assert.ok(cardIdx < shadowIdx, 'card before shadow-sm')
    assert.ok(cardIdx < mb3Idx, 'card before mb-3')
    assert.ok(cardIdx < borderIdx, 'card before border-0')
  })

  it('handles Bootstrap navbar example', () => {
    const input = 'bg-body-tertiary fixed-top navbar navbar-expand-lg'
    const sorted = sortClasses(input.split(/\s+/))

    // navbar classes should come before utility classes
    const navbarIdx = sorted.indexOf('navbar')
    const bgIdx = sorted.indexOf('bg-body-tertiary')

    assert.ok(navbarIdx < bgIdx, 'navbar before bg-body-tertiary')
  })

  it('handles complex responsive grid layout', () => {
    const input = 'p-3 col-md-6 col-lg-4 col mb-2'
    const sorted = sortClasses(input.split(/\s+/))

    // col classes (layout) should come before p- and mb- (utilities)
    const colIdx = sorted.indexOf('col')
    const p3Idx = sorted.indexOf('p-3')

    assert.ok(colIdx < p3Idx, 'col before p-3')
  })

  it('handles flexbox utility combinations', () => {
    const input = 'gap-3 align-items-center justify-content-between d-flex'
    const sorted = sortClasses(input.split(/\s+/))

    // d-flex (display) should come before flex-related utilities
    const dFlexIdx = sorted.indexOf('d-flex')
    const justifyIdx = sorted.indexOf('justify-content-between')
    const alignIdx = sorted.indexOf('align-items-center')
    const gapIdx = sorted.indexOf('gap-3')

    assert.ok(dFlexIdx < justifyIdx, 'd-flex before justify-content-between')
    assert.ok(dFlexIdx < alignIdx, 'd-flex before align-items-center')
    assert.ok(alignIdx < gapIdx, 'align-items before gap')
  })

  it('handles button variants', () => {
    const input = 'px-4 btn btn-primary btn-lg rounded-pill'
    const sorted = sortClasses(input.split(/\s+/))

    // btn classes (component) should come before utilities
    const btnIdx = sorted.indexOf('btn')
    const pxIdx = sorted.indexOf('px-4')
    const roundedIdx = sorted.indexOf('rounded-pill')

    assert.ok(btnIdx < pxIdx, 'btn before px-4')
    assert.ok(btnIdx < roundedIdx, 'btn before rounded-pill')
  })

  it('handles form elements', () => {
    const input = 'mb-3 form-control form-control-lg is-invalid'
    const sorted = sortClasses(input.split(/\s+/))

    // form-control (form component) should come before mb-3 (utility)
    const formIdx = sorted.indexOf('form-control')
    const mbIdx = sorted.indexOf('mb-3')

    assert.ok(formIdx < mbIdx, 'form-control before mb-3')
  })
})
