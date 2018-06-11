import Alert from './alert'
import Button from './button'
import Carousel from './carousel'
import Collapse from './collapse'
import Dropdown from './dropdown'
import EventHandler from './dom/eventHandler'
import Modal from './modal'
import Polyfill from './dom/polyfill'
import Popover from './popover'
import ScrollSpy from './scrollspy'
import Tab from './tab'
import Toast from './toast'
import Tooltip from './tooltip'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.1): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/* istanbul ignore next */
// focusin and focusout polyfill
if (Polyfill.focusIn) {
  (() => {
    function listenerFocus(event) {
      EventHandler.trigger(event.target, 'focusin')
    }
    function listenerBlur(event) {
      EventHandler.trigger(event.target, 'focusout')
    }
    EventHandler.on(document, 'focus', 'input', listenerFocus)
    EventHandler.on(document, 'blur', 'input', listenerBlur)
  })()
}

export {
  Util,
  Alert,
  Button,
  Carousel,
  Collapse,
  Dropdown,
  Modal,
  Popover,
  ScrollSpy,
  Tab,
  Toast,
  Tooltip
}
