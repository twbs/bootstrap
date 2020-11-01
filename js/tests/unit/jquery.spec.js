/* eslint-env jquery */
import Alert from '../../src/alert'
import Button from '../../src/button'
import Carousel from '../../src/carousel'
import Collapse from '../../src/collapse'
import Dropdown from '../../src/dropdown'
import Modal from '../../src/modal'
import Popover from '../../src/popover'
import ScrollSpy from '../../src/scrollspy'
import Tab from '../../src/tab'
import Toast from '../../src/toast'
import Tooltip from '../../src/tooltip'

/** Test helpers */
import { getFixture, clearFixture } from '../helpers/fixture'

describe('jQuery', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should add all plugins in jQuery', () => {
    expect(Alert.jQueryInterface).toEqual(jQuery.fn.alert)
    expect(Button.jQueryInterface).toEqual(jQuery.fn.button)
    expect(Carousel.jQueryInterface).toEqual(jQuery.fn.carousel)
    expect(Collapse.jQueryInterface).toEqual(jQuery.fn.collapse)
    expect(Dropdown.jQueryInterface).toEqual(jQuery.fn.dropdown)
    expect(Modal.jQueryInterface).toEqual(jQuery.fn.modal)
    expect(Popover.jQueryInterface).toEqual(jQuery.fn.popover)
    expect(ScrollSpy.jQueryInterface).toEqual(jQuery.fn.scrollspy)
    expect(Tab.jQueryInterface).toEqual(jQuery.fn.tab)
    expect(Toast.jQueryInterface).toEqual(jQuery.fn.toast)
    expect(Tooltip.jQueryInterface).toEqual(jQuery.fn.tooltip)
  })

  it('should use jQuery event system', done => {
    fixtureEl.innerHTML = [
      '<div class="alert">',
      '  <button type="button" data-dismiss="alert">x</button>',
      '</div>'
    ].join('')

    $(fixtureEl).find('.alert')
      .one('closed.bs.alert', () => {
        expect($(fixtureEl).find('.alert').length).toEqual(0)
        done()
      })

    $(fixtureEl).find('button').click()
  })
})
