import $ from 'jquery'
import Alert from './alert'
import Button from './button'
import Carousel from './carousel'
import Collapse from './collapse'
import Dropdown from './dropdown'
import Modal from './modal'
import Popover from './popover'
import Scrollspy from './scrollspy'
import Tab from './tab'
import Tooltip from './tooltip'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(() => {
  if (typeof $ === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
  }

  const version = $.fn.jquery.split(' ')[0].split('.')
  const min = 3
  const max = 4
  if (version[0] < min || version[0] >= max) {
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v3.0.0 but less than v4.0.0')
  }
})($)

export {
  Util,
  Alert,
  Button,
  Carousel,
  Collapse,
  Dropdown,
  Modal,
  Popover,
  Scrollspy,
  Tab,
  Tooltip
}
