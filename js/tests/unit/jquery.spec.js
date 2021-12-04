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
import { clearFixture, getFixture } from '../helpers/fixture'
import { getJqueryInterfaceForPlugin } from '../../src/util/jquery-stuff'

describe('jQuery', () => {
  let fixtureEl
  const plugins = [
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  ]

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should add all plugins in jQuery', () => {
    for (const plugin of plugins) {
      getJqueryInterfaceForPlugin(plugin)
    }

    expect(jQuery.fn.alert).toBeDefined()
    expect(jQuery.fn.button).toBeDefined()
    expect(jQuery.fn.carousel).toBeDefined()
    expect(jQuery.fn.collapse).toBeDefined()
    expect(jQuery.fn.dropdown).toBeDefined()
    expect(jQuery.fn.modal).toBeDefined()
    expect(jQuery.fn.offcanvas).toBeDefined()
    expect(jQuery.fn.popover).toBeDefined()
    expect(jQuery.fn.scrollspy).toBeDefined()
    expect(jQuery.fn.tab).toBeDefined()
    expect(jQuery.fn.toast).toBeDefined()
    expect(jQuery.fn.tooltip).toBeDefined()
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
