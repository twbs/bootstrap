import { Selector } from 'testcafe'

export class Accordion {
  constructor(selector) {
    this.mainElement = selector

    this.cards = this.mainElement.find('.card')
  }

  card(index) {
    const card   = this.cards.nth(index)
    const header = card.find('.card-header')
    const block  = card.find('.card-block')

    return {
      header,
      block
    }
  }
}

export class ModalDialog {
  constructor(selector) {
    this.TRANSITION_TIMEOUT = 200

    this.mainElement = selector

    this.button                = this.mainElement.find('button').withText('button')
    this.linkWithTopTooltip    = this.mainElement.find('a[data-original-title="Tooltip on top"]')
    this.linkWithBottomTooltip = this.mainElement.find('a[data-original-title="Tooltip on bottom"]')
    this.accordion             = new Accordion(Selector('#accordion'))
    this.saveButton            = this.mainElement.find('button').withText('Save changes')
    this.closeButton           = this.mainElement.find('button').withText('Close')
  }

  isVisible() {
    return this.mainElement.visible
  }
}

export class ModalDemoPage {
  constructor() {
    this.launchDemoModalBtn = Selector('button').withText('Launch demo modal')
    this.modalDialog        = new ModalDialog(Selector('.modal-dialog'))
    this.popoverTitle       = Selector('h3.popover-title')
    this.tooltip            = Selector('.tooltip')
  }

  async waitForDialogTransition(t) {
    // When the tested page is opened, the modal dialog appears for a moment and then hides
    await t
      // Ensure the page is loaded
      .expect(Selector('body').exists).ok()
      // Wait while transition is finished and the dialog is hidden
      .wait(this.modalDialog.TRANSITION_TIMEOUT)
      .expect(this.modalDialog.isVisible()).notOk()
  }

  async openDialog(t) {
    await t
      .click(this.launchDemoModalBtn)
      .expect(this.modalDialog.isVisible()).ok()
      .wait(this.modalDialog.TRANSITION_TIMEOUT)
  }
}
