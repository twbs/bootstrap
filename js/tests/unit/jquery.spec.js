/* eslint-env jquery */

import Alert from '../../src/alert'
import Button from '../../src/button'
import Carousel from '../../src/carousel'
import Collapse from '../../src/collapse'
import Dropdown from '../../src/dropdown'
import Modal from '../../src/modal'
import Offcanvas from '../../src/offcanvas'
import Popover from '../../src/popover'
import ScrollSpy from '../../src/scrollspy'
import Tab from '../../src/tab'
import Toast from '../../src/toast'
import Tooltip from '../../src/tooltip'
import { getFixture, clearFixture } from '../helpers/fixture'
import { getJqueryInterfaceForPlugin } from '../../src/util/jquery-stuff'

describe('jQuery', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should add all plugins in jQuery', () => {
    expect(getJqueryInterfaceForPlugin(Alert)).toEqual(jQuery.fn.alert)
    expect(getJqueryInterfaceForPlugin(Button)).toEqual(jQuery.fn.button)
    expect(getJqueryInterfaceForPlugin(Carousel)).toEqual(jQuery.fn.carousel)
    expect(getJqueryInterfaceForPlugin(Collapse)).toEqual(jQuery.fn.collapse)
    expect(getJqueryInterfaceForPlugin(Dropdown)).toEqual(jQuery.fn.dropdown)
    expect(getJqueryInterfaceForPlugin(Modal)).toEqual(jQuery.fn.modal)
    expect(getJqueryInterfaceForPlugin(Offcanvas)).toEqual(jQuery.fn.offcanvas)
    expect(getJqueryInterfaceForPlugin(Popover)).toEqual(jQuery.fn.popover)
    expect(getJqueryInterfaceForPlugin(ScrollSpy)).toEqual(jQuery.fn.scrollspy)
    expect(getJqueryInterfaceForPlugin(Tab)).toEqual(jQuery.fn.tab)
    expect(getJqueryInterfaceForPlugin(Toast)).toEqual(jQuery.fn.toast)
    expect(getJqueryInterfaceForPlugin(Tooltip)).toEqual(jQuery.fn.tooltip)
  })

  it('should use jQuery event system', () => {
    return new Promise(resolve => {
      fixtureEl.innerHTML = [
        '<div class="alert">',
        '  <button type="button" data-bs-dismiss="alert">x</button>',
        '</div>'
      ].join('')

      $(fixtureEl).find('.alert')
        .one('closed.bs.alert', () => {
          expect($(fixtureEl).find('.alert')).toHaveSize(0)
          resolve()
        })

      $(fixtureEl).find('button').trigger('click')
    })
  })
})
