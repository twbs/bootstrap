/**
 * --------------------------------------------------------------------------
 * Bootstrap type-level consumer tests
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 * Compile-time assertions for the SHIPPED public TypeScript API. This file
 * imports through the package name and the deep-import subpath, exactly as a
 * downstream project does. Node resolves both through the `exports` map, so
 * the types come from the emitted declarations (`js/dist/*.d.ts`), not the
 * `js/src/*.ts` source. It proves consumers need no `@types/bootstrap`.
 *
 * It is only type-checked (`npm run js-typecheck-dist`, after the build emits
 * the declarations); it is never executed or bundled. The sibling `api.ts`
 * checks the same surface against the source.
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
} from 'bootstrap'
import BaseComponent from 'bootstrap/js/src/base-component.js'
import DeepTooltip, { type TooltipConfig } from 'bootstrap/js/src/tooltip.js'
import EventHandler from 'bootstrap/js/src/dom/event-handler.js'
import SelectorEngine from 'bootstrap/js/src/dom/selector-engine.js'
import type { CarouselConfig } from 'bootstrap/js/src/carousel.js'
import type { ChipsConfig } from 'bootstrap/js/src/chips.js'
import type { CollapseConfig } from 'bootstrap/js/src/collapse.js'
import type { ComboboxConfig } from 'bootstrap/js/src/combobox.js'
import type { DatepickerConfig } from 'bootstrap/js/src/datepicker.js'
import type { DialogConfig } from 'bootstrap/js/src/dialog.js'
import type { DrawerConfig } from 'bootstrap/js/src/drawer.js'
import type { NavOverflowConfig } from 'bootstrap/js/src/nav-overflow.js'
import type { OtpInputConfig } from 'bootstrap/js/src/otp-input.js'
import type { ScrollSpyConfig } from 'bootstrap/js/src/scrollspy.js'
import type { StrengthConfig } from 'bootstrap/js/src/strength.js'
import type { ToastConfig } from 'bootstrap/js/src/toast.js'
import type { TogglerConfig } from 'bootstrap/js/src/toggler.js'

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
const otpInput: OtpInput = new OtpInput(element, { length: 6, type: 'alphanumeric', mask: true })
const scrollSpy: ScrollSpy = new ScrollSpy(element, { smoothScroll: true })
const strength: Strength = new Strength(element, { minLength: 12 })
const toggler: Toggler = new Toggler(element, { attribute: 'class', value: 'active' })

// Button and Tab take no config
const button: Button = new Button(element)
const tab: Tab = new Tab('#tab')

// The Vanilla Calendar Pro literal unions have to survive the `.d.ts` emit, or
// consumers would silently get a wider type than the source enforces
const datepicker: Datepicker = new Datepicker(element, {
  displayMonthsCount: 2,
  firstWeekday: 1,
  selectionMode: 'multiple-ranged',
  placement: 'center',
  dateMin: '2026-01-01'
})

// @ts-expect-error — `firstWeekday` is a WeekDayID, so 0-6 only
new Datepicker(element, { firstWeekday: 7 })

// @ts-expect-error — `selectionMode` is a DateMode
new Datepicker(element, { selectionMode: 'triple' })

// The deep default import resolves to the same class through the subpath remap
const deepTooltip: DeepTooltip = new DeepTooltip(element)

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

// getOrCreateInstance types its config per component through the shipped types
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
