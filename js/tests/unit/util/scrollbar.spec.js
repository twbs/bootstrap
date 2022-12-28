import { clearBodyAndDocument, clearFixture, getFixture } from '../../helpers/fixture'
import Manipulator from '../../../src/dom/manipulator'
import ScrollBarHelper from '../../../src/util/scrollbar'

describe('ScrollBar', () => {
  let fixtureEl
  const doc = document.documentElement
  const parseIntDecimal = arg => Number.parseInt(arg, 10)
  const getPaddingX = el => parseIntDecimal(window.getComputedStyle(el).paddingRight)
  const getMarginX = el => parseIntDecimal(window.getComputedStyle(el).marginRight)
  const getOverFlow = el => el.style.overflow
  const getPaddingAttr = el => Manipulator.getDataAttribute(el, 'padding-right')
  const getMarginAttr = el => Manipulator.getDataAttribute(el, 'margin-right')
  const getOverFlowAttr = el => Manipulator.getDataAttribute(el, 'overflow')
  const windowCalculations = () => {
    return {
      htmlClient: document.documentElement.clientWidth,
      htmlOffset: document.documentElement.offsetWidth,
      docClient: document.body.clientWidth,
      htmlBound: document.documentElement.getBoundingClientRect().width,
      bodyBound: document.body.getBoundingClientRect().width,
      window: window.innerWidth,
      width: Math.abs(window.innerWidth - document.documentElement.clientWidth)
    }
  }

  // iOS, Android devices and macOS browsers hide scrollbar by default and show it only while scrolling.
  // So the tests for scrollbar would fail
  const isScrollBarHidden = () => {
    const calc = windowCalculations()
    return calc.htmlClient === calc.htmlOffset && calc.htmlClient === calc.window
  }

  beforeAll(() => {
    fixtureEl = getFixture()
    // custom fixture to avoid extreme style values
    fixtureEl.removeAttribute('style')
  })

  afterAll(() => {
    fixtureEl.remove()
  })

  afterEach(() => {
    clearFixture()
    clearBodyAndDocument()
  })

  beforeEach(() => {
    clearBodyAndDocument()
  })

  describe('isBodyOverflowing', () => {
    it('should return true if body is overflowing', () => {
      document.documentElement.style.overflowY = 'scroll'
      document.body.style.overflowY = 'scroll'
      fixtureEl.innerHTML = '<div style="height: 110vh; width: 100%"></div>'
      const result = new ScrollBarHelper().isOverflowing()

      if (isScrollBarHidden()) {
        expect(result).toBeFalse()
      } else {
        expect(result).toBeTrue()
      }
    })

    it('should return false if body is not overflowing', () => {
      doc.style.overflowY = 'hidden'
      document.body.style.overflowY = 'hidden'
      fixtureEl.innerHTML = '<div style="height: 110vh; width: 100%"></div>'
      const scrollBar = new ScrollBarHelper()
      const result = scrollBar.isOverflowing()

      expect(result).toBeFalse()
    })
  })

  describe('getWidth', () => {
    it('should return an integer greater than zero, if body is overflowing', () => {
      doc.style.overflowY = 'scroll'
      document.body.style.overflowY = 'scroll'
      fixtureEl.innerHTML = '<div style="height: 110vh; width: 100%"></div>'
      const result = new ScrollBarHelper().getWidth()

      if (isScrollBarHidden()) {
        expect(result).toEqual(0)
      } else {
        expect(result).toBeGreaterThan(1)
      }
    })

    it('should return 0 if body is not overflowing', () => {
      document.documentElement.style.overflowY = 'hidden'
      document.body.style.overflowY = 'hidden'
      fixtureEl.innerHTML = '<div style="height: 110vh; width: 100%"></div>'

      const result = new ScrollBarHelper().getWidth()

      expect(result).toEqual(0)
    })
  })

  describe('hide - reset', () => {
    it('should adjust the inline padding of fixed elements which are full-width', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%">',
        '  <div class="fixed-top" id="fixed1" style="padding-right: 0px; width: 100vw"></div>',
        '  <div class="fixed-top" id="fixed2" style="padding-right: 5px; width: 100vw"></div>',
        '</div>'
      ].join('')
      doc.style.overflowY = 'scroll'

      const fixedEl = fixtureEl.querySelector('#fixed1')
      const fixedEl2 = fixtureEl.querySelector('#fixed2')
      const originalPadding = getPaddingX(fixedEl)
      const originalPadding2 = getPaddingX(fixedEl2)
      const scrollBar = new ScrollBarHelper()
      const expectedPadding = originalPadding + scrollBar.getWidth()
      const expectedPadding2 = originalPadding2 + scrollBar.getWidth()

      scrollBar.hide()

      let currentPadding = getPaddingX(fixedEl)
      let currentPadding2 = getPaddingX(fixedEl2)
      expect(getPaddingAttr(fixedEl)).toEqual(`${originalPadding}px`)
      expect(getPaddingAttr(fixedEl2)).toEqual(`${originalPadding2}px`)
      expect(currentPadding).toEqual(expectedPadding)
      expect(currentPadding2).toEqual(expectedPadding2)

      scrollBar.reset()
      currentPadding = getPaddingX(fixedEl)
      currentPadding2 = getPaddingX(fixedEl2)
      expect(getPaddingAttr(fixedEl)).toBeNull()
      expect(getPaddingAttr(fixedEl2)).toBeNull()
      expect(currentPadding).toEqual(originalPadding)
      expect(currentPadding2).toEqual(originalPadding2)
    })

    it('should remove padding & margin if not existed before adjustment', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%">',
        '  <div class="fixed" id="fixed" style="width: 100vw;"></div>',
        '  <div class="sticky-top" id="sticky" style=" width: 100vw;"></div>',
        '</div>'
      ].join('')
      doc.style.overflowY = 'scroll'

      const fixedEl = fixtureEl.querySelector('#fixed')
      const stickyEl = fixtureEl.querySelector('#sticky')
      const scrollBar = new ScrollBarHelper()

      scrollBar.hide()
      scrollBar.reset()

      expect(fixedEl.getAttribute('style').includes('padding-right')).toBeFalse()
      expect(stickyEl.getAttribute('style').includes('margin-right')).toBeFalse()
    })

    it('should adjust the inline margin and padding of sticky elements', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh">',
        '  <div class="sticky-top" style="margin-right: 10px; padding-right: 20px; width: 100vw; height: 10px"></div>',
        '</div>'
      ].join('')
      doc.style.overflowY = 'scroll'

      const stickyTopEl = fixtureEl.querySelector('.sticky-top')
      const originalMargin = getMarginX(stickyTopEl)
      const originalPadding = getPaddingX(stickyTopEl)
      const scrollBar = new ScrollBarHelper()
      const expectedMargin = originalMargin - scrollBar.getWidth()
      const expectedPadding = originalPadding + scrollBar.getWidth()
      scrollBar.hide()

      expect(getMarginAttr(stickyTopEl)).toEqual(`${originalMargin}px`)
      expect(getMarginX(stickyTopEl)).toEqual(expectedMargin)
      expect(getPaddingAttr(stickyTopEl)).toEqual(`${originalPadding}px`)
      expect(getPaddingX(stickyTopEl)).toEqual(expectedPadding)

      scrollBar.reset()
      expect(getMarginAttr(stickyTopEl)).toBeNull()
      expect(getMarginX(stickyTopEl)).toEqual(originalMargin)
      expect(getPaddingAttr(stickyTopEl)).toBeNull()
      expect(getPaddingX(stickyTopEl)).toEqual(originalPadding)
    })

    it('should not adjust the inline margin and padding of sticky and fixed elements when element do not have full width', () => {
      fixtureEl.innerHTML = '<div class="sticky-top" style="margin-right: 0px; padding-right: 0px; width: 50vw"></div>'

      const stickyTopEl = fixtureEl.querySelector('.sticky-top')
      const originalMargin = getMarginX(stickyTopEl)
      const originalPadding = getPaddingX(stickyTopEl)

      const scrollBar = new ScrollBarHelper()
      scrollBar.hide()

      const currentMargin = getMarginX(stickyTopEl)
      const currentPadding = getPaddingX(stickyTopEl)

      expect(currentMargin).toEqual(originalMargin)
      expect(currentPadding).toEqual(originalPadding)

      scrollBar.reset()
    })

    it('should not put data-attribute if element doesn\'t have the proper style property, should just remove style property if element didn\'t had one', () => {
      fixtureEl.innerHTML = [
        '<div style="height: 110vh; width: 100%">',
        '  <div class="sticky-top" id="sticky" style="width: 100vw"></div>',
        '</div>'
      ].join('')

      document.body.style.overflowY = 'scroll'
      const scrollBar = new ScrollBarHelper()

      const hasPaddingAttr = el => el.hasAttribute('data-bs-padding-right')
      const hasMarginAttr = el => el.hasAttribute('data-bs-margin-right')
      const stickyEl = fixtureEl.querySelector('#sticky')
      const originalPadding = getPaddingX(stickyEl)
      const originalMargin = getMarginX(stickyEl)
      const scrollBarWidth = scrollBar.getWidth()

      scrollBar.hide()

      expect(getPaddingX(stickyEl)).toEqual(scrollBarWidth + originalPadding)
      const expectedMargin = scrollBarWidth + originalMargin
      expect(getMarginX(stickyEl)).toEqual(expectedMargin === 0 ? expectedMargin : -expectedMargin)
      expect(hasMarginAttr(stickyEl)).toBeFalse() // We do not have to keep css margin
      expect(hasPaddingAttr(stickyEl)).toBeFalse() // We do not have to keep css padding

      scrollBar.reset()

      expect(getPaddingX(stickyEl)).toEqual(originalPadding)
      expect(getPaddingX(stickyEl)).toEqual(originalPadding)
    })

    describe('Body Handling', () => {
      it('should ignore other inline styles when trying to restore body defaults ', () => {
        document.body.style.color = 'red'

        const scrollBar = new ScrollBarHelper()
        const scrollBarWidth = scrollBar.getWidth()
        scrollBar.hide()

        expect(getPaddingX(document.body)).toEqual(scrollBarWidth)
        expect(document.body.style.color).toEqual('red')

        scrollBar.reset()
      })

      it('should hide scrollbar and reset it to its initial value', () => {
        const styleSheetPadding = '7px'
        fixtureEl.innerHTML = [
          '<style>',
          '  body {',
          `    padding-right: ${styleSheetPadding}`,
          '  }',
          '</style>'
        ].join('')

        const el = document.body
        const inlineStylePadding = '10px'
        el.style.paddingRight = inlineStylePadding

        const originalPadding = getPaddingX(el)
        expect(originalPadding).toEqual(parseIntDecimal(inlineStylePadding)) // Respect only the inline style as it has prevails this of css
        const originalOverFlow = 'auto'
        el.style.overflow = originalOverFlow
        const scrollBar = new ScrollBarHelper()
        const scrollBarWidth = scrollBar.getWidth()

        scrollBar.hide()

        const currentPadding = getPaddingX(el)

        expect(currentPadding).toEqual(scrollBarWidth + originalPadding)
        expect(currentPadding).toEqual(scrollBarWidth + parseIntDecimal(inlineStylePadding))
        expect(getPaddingAttr(el)).toEqual(inlineStylePadding)
        expect(getOverFlow(el)).toEqual('hidden')
        expect(getOverFlowAttr(el)).toEqual(originalOverFlow)

        scrollBar.reset()

        const currentPadding1 = getPaddingX(el)
        expect(currentPadding1).toEqual(originalPadding)
        expect(getPaddingAttr(el)).toBeNull()
        expect(getOverFlow(el)).toEqual(originalOverFlow)
        expect(getOverFlowAttr(el)).toBeNull()
      })

      it('should hide scrollbar and reset it to its initial value - respecting css rules', () => {
        const styleSheetPadding = '7px'
        fixtureEl.innerHTML = [
          '<style>',
          '  body {',
          `    padding-right: ${styleSheetPadding}`,
          '  }',
          '</style>'
        ].join('')
        const el = document.body
        const originalPadding = getPaddingX(el)
        const originalOverFlow = 'scroll'
        el.style.overflow = originalOverFlow
        const scrollBar = new ScrollBarHelper()
        const scrollBarWidth = scrollBar.getWidth()

        scrollBar.hide()

        const currentPadding = getPaddingX(el)

        expect(currentPadding).toEqual(scrollBarWidth + originalPadding)
        expect(currentPadding).toEqual(scrollBarWidth + parseIntDecimal(styleSheetPadding))
        expect(getPaddingAttr(el)).toBeNull() // We do not have to keep css padding
        expect(getOverFlow(el)).toEqual('hidden')
        expect(getOverFlowAttr(el)).toEqual(originalOverFlow)

        scrollBar.reset()

        const currentPadding1 = getPaddingX(el)
        expect(currentPadding1).toEqual(originalPadding)
        expect(getPaddingAttr(el)).toBeNull()
        expect(getOverFlow(el)).toEqual(originalOverFlow)
        expect(getOverFlowAttr(el)).toBeNull()
      })

      it('should not adjust the inline body padding when it does not overflow', () => {
        const originalPadding = getPaddingX(document.body)
        const scrollBar = new ScrollBarHelper()

        // Hide scrollbars to prevent the body overflowing
        doc.style.overflowY = 'hidden'
        doc.style.paddingRight = '0px'

        scrollBar.hide()
        const currentPadding = getPaddingX(document.body)

        expect(currentPadding).toEqual(originalPadding)
        scrollBar.reset()
      })

      it('should not adjust the inline body padding when it does not overflow, even on a scaled display', () => {
        const originalPadding = getPaddingX(document.body)
        const scrollBar = new ScrollBarHelper()
        // Remove body margins as would be done by Bootstrap css
        document.body.style.margin = '0'

        // Hide scrollbars to prevent the body overflowing
        doc.style.overflowY = 'hidden'

        // Simulate a discrepancy between exact, i.e. floating point body width, and rounded body width
        // as it can occur when zooming or scaling the display to something else than 100%
        doc.style.paddingRight = '.48px'
        scrollBar.hide()

        const currentPadding = getPaddingX(document.body)

        expect(currentPadding).toEqual(originalPadding)

        scrollBar.reset()
      })
    })
  })
})
