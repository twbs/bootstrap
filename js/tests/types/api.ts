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
  Button,
  Carousel,
  Chips,
  Collapse,
  Combobox,
  Datepicker,
  Dialog,
  Drawer,
  Menu,
  NavOverflow,
  OtpInput,
  Popover,
  Range,
  ScrollSpy,
  Strength,
  Tab,
  Toast,
  Toggler,
  Tooltip
} from '../../src/index.js'
import BaseComponent from '../../src/base-component.js'
import EventHandler from '../../src/dom/event-handler.js'
import SelectorEngine from '../../src/dom/selector-engine.js'
import type { CarouselConfig } from '../../src/carousel.js'
import type { ChipsConfig } from '../../src/chips.js'
import type { CollapseConfig } from '../../src/collapse.js'
import type { ComboboxConfig } from '../../src/combobox.js'
import type { DatepickerConfig } from '../../src/datepicker.js'
import type { DialogConfig } from '../../src/dialog.js'
import type { DrawerConfig } from '../../src/drawer.js'
import type { NavOverflowConfig } from '../../src/nav-overflow.js'
import type { OtpInputConfig } from '../../src/otp-input.js'
import type { ScrollSpyConfig } from '../../src/scrollspy.js'
import type { StrengthConfig } from '../../src/strength.js'
import type { ToastConfig } from '../../src/toast.js'
import type { TogglerConfig } from '../../src/toggler.js'
import type { TooltipConfig } from '../../src/tooltip.js'

declare const element: HTMLElement

// Constructors accept a selector, an element, or nothing, plus a partial config
const tooltipFromSelector: Tooltip = new Tooltip('#tip', { animation: false })
const tooltipFromElement: Tooltip = new Tooltip(element)
const toast: Toast = new Toast(element, { autohide: false, delay: 5000 })
const collapse: Collapse = new Collapse(element, { parent: '#accordion' })
const carousel: Carousel = new Carousel(element, { interval: 2000 })
const dialog: Dialog = new Dialog(element, { modal: true, keyboard: false })
const drawer: Drawer = new Drawer(element, { scroll: true })
const popover: Popover = new Popover(element, { content: 'Hello', animation: true })
const range: Range = new Range(element, { formatter: value => `${value} %` })
const chips: Chips = new Chips(element, { separator: ';', maxChips: 5, allowDuplicates: true })
const combobox: Combobox = new Combobox(element, { multiple: true, placeholder: 'Pick one' })
const navOverflow: NavOverflow = new NavOverflow(element, { moreText: 'More', collapseBelow: 768 })
const navOverflowIconOnly: NavOverflow = new NavOverflow(element, { moreText: false })
const otpInput: OtpInput = new OtpInput(element, { length: 6, type: 'alphanumeric', mask: true })
const scrollSpy: ScrollSpy = new ScrollSpy(element, { smoothScroll: true })
const strength: Strength = new Strength(element, { minLength: 12 })
const toggler: Toggler = new Toggler(element, { attribute: 'class', value: 'active' })

// Button and Tab take no config
const button: Button = new Button(element)
const tab: Tab = new Tab('#tab')

// Datepicker forwards these straight to Vanilla Calendar Pro, so its config uses
// that library's literal unions rather than plain `string` / `number`
const datepicker: Datepicker = new Datepicker(element, {
  displayMonthsCount: 2,
  firstWeekday: 1,
  selectionMode: 'multiple-ranged',
  placement: 'center',
  dateMin: '2026-01-01'
})

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
const chipsDefault: ChipsConfig = Chips.Default
const comboboxDefault: ComboboxConfig = Combobox.Default
const datepickerDefault: DatepickerConfig = Datepicker.Default
const navOverflowDefault: NavOverflowConfig = NavOverflow.Default
const otpInputDefault: OtpInputConfig = OtpInput.Default
const scrollSpyDefault: ScrollSpyConfig = ScrollSpy.Default
const strengthDefault: StrengthConfig = Strength.Default
const togglerDefault: TogglerConfig = Toggler.Default
const tooltipDelay: number | { show: number, hide: number } = tooltipDefault.delay
const strengthWeakLabel: string = strengthDefault.messages.weak

// Instance API
createdAlert.close()
tooltipFromSelector.show()
tooltipFromElement.dispose()
toast.dispose()

// Show, hide, toggle, and close return a promise that settles once the component
// finishes, so callers can await them instead of listening for `shown.bs.*`
const closing: Promise<void> = createdAlert.close()
const collapseShowing: Promise<void> = collapse.show()
const collapseHiding: Promise<void> = collapse.hide()
const collapseToggling: Promise<void> = collapse.toggle()
const dialogShowing: Promise<void> = dialog.show()
const drawerHiding: Promise<void> = drawer.hide()
const toastShowing: Promise<void> = toast.show()
const tabShowing: Promise<void> = tab.show()
const tooltipToggling: Promise<void> = tooltipFromElement.toggle()
const popoverShowing: Promise<void> = popover.show()
const comboboxToggling: Promise<void> = combobox.toggle()
const datepickerShowing: Promise<void> = datepicker.show()

// Awaiting a lifecycle method yields no value
const awaitLifecycle = async (): Promise<void> => {
  const resolved: void = await collapse.show()
  return resolved
}

// @ts-expect-error — the promise resolves to void, not a component
const wrongResolution: Promise<Collapse> = collapse.show()

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
new Collapse(element, { parent: 42 })

// The Vanilla Calendar Pro unions reject out-of-range values, which a plain
// `number` or `string` would have accepted silently
// @ts-expect-error — `firstWeekday` is a WeekDayID, so 0-6 only
new Datepicker(element, { firstWeekday: 7 })

// @ts-expect-error — `displayMonthsCount` is a MonthsCount, so 1-12 only
new Datepicker(element, { displayMonthsCount: 13 })

// @ts-expect-error — `selectionMode` is a DateMode
new Datepicker(element, { selectionMode: 'triple' })

// @ts-expect-error — `placement` is a PositionToInput
new Datepicker(element, { placement: 'sideways' })

// getOrCreateInstance types its config per component, not just the constructor
Toast.getOrCreateInstance(element, { autohide: false })

// @ts-expect-error — unknown keys are rejected on the static path too
Toast.getOrCreateInstance(element, { autohype: true })

// @ts-expect-error — getInstance may return null; using it directly must fail
Alert.getInstance('#alert').close()

// Internals are protected: consumers cannot reach a component's private state
// @ts-expect-error — _config is protected
tooltipFromElement._config
// @ts-expect-error — _element is protected
toast._element
// @ts-expect-error — internal methods are protected
carousel._getItems()
