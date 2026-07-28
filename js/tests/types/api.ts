/**
 * --------------------------------------------------------------------------
 * Bootstrap type-level API tests
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 * Compile-time assertions for the public TypeScript API. This file is only
 * type-checked (`npm run js-typecheck`); it is never executed or bundled.
 */

import {
  Alert,
  Carousel,
  Collapse,
  Dialog,
  Drawer,
  Menu,
  Popover,
  Range,
  Toast,
  Tooltip
} from '../../index.js'
import BaseComponent from '../../src/base-component.js'
import EventHandler from '../../src/dom/event-handler.js'
import SelectorEngine from '../../src/dom/selector-engine.js'
import type { CarouselConfig } from '../../src/carousel.js'
import type { CollapseConfig } from '../../src/collapse.js'
import type { DialogConfig } from '../../src/dialog.js'
import type { DrawerConfig } from '../../src/drawer.js'
import type { ToastConfig } from '../../src/toast.js'
import type { TooltipConfig } from '../../src/tooltip.js'

declare const element: HTMLElement

// Constructors accept a selector, an element, or nothing, plus a partial config
const tooltipFromSelector: Tooltip = new Tooltip('#tip', { animation: false })
const tooltipFromElement: Tooltip = new Tooltip(element)
const toast: Toast = new Toast(element, { autohide: false, delay: 5000 })
const collapse: Collapse = new Collapse(element, { toggle: false })
const carousel: Carousel = new Carousel(element, { interval: 2000 })
const dialog: Dialog = new Dialog(element, { modal: true, keyboard: false })
const drawer: Drawer = new Drawer(element, { scroll: true })
const popover: Popover = new Popover(element, { content: 'Hello', animation: true })
const range: Range = new Range(element, { formatter: value => `${value} %` })

// Static helpers resolve to the concrete component type
const maybeAlert: Alert | null = Alert.getInstance('#alert')
const createdAlert: Alert = Alert.getOrCreateInstance(element)
const maybeMenu: Menu | null = Menu.getInstance(element)
const baseInstance: BaseComponent | null = BaseComponent.getInstance(element)

// Static metadata
const version: string = Tooltip.VERSION
const name: string = Toast.NAME
const dataKey: string = Collapse.DATA_KEY
const eventKey: string = Carousel.EVENT_KEY
const eventName: string = Toast.eventName('show')

// Default objects are typed with each component's config shape
const tooltipDefault: TooltipConfig = Tooltip.Default
const toastDefault: ToastConfig = Toast.Default
const collapseDefault: CollapseConfig = Collapse.Default
const carouselDefault: CarouselConfig = Carousel.Default
const dialogDefault: DialogConfig = Dialog.Default
const drawerDefault: DrawerConfig = Drawer.Default
const tooltipDelay: number | { show: number, hide: number } = tooltipDefault.delay

// Instance API
createdAlert.close()
tooltipFromSelector.show()
tooltipFromElement.dispose()
toast.dispose()

// EventHandler.trigger is non-null for a non-null element…
const triggered: Event = EventHandler.trigger(element, 'shown.bs.tooltip')
// …and nullable when the element may be null
const maybeTriggered: Event | null = EventHandler.trigger(document.getElementById('x'), 'x')

// SelectorEngine defaults to HTMLElement and accepts narrowing generics
const found: HTMLElement[] = SelectorEngine.find('.item')
const foundOne: HTMLElement | null = SelectorEngine.findOne('.item', element)
const inputs: HTMLInputElement[] = SelectorEngine.find<HTMLInputElement>('input')

// @ts-expect-error — unknown config keys are rejected
new Toast(element, { autohype: true })

// @ts-expect-error — config value types are enforced
new Collapse(element, { toggle: 'yes' })

// @ts-expect-error — getInstance may return null; using it directly must fail
Alert.getInstance('#alert').close()
