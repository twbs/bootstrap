import { ModalDemoPage } from './page-model'

const page = new ModalDemoPage()

fixture('Bootstrap - Modal')
  .page('http://localhost:3000/js/tests/visual/modal.html')
  .beforeEach(async (t) => await page.waitForDialogTransition(t))

test('Modal page', async (t) => {
  // Open modal dialog
  await page.openDialog(t)

  // Click on the button and check popover
  await t
    .click(page.modalDialog.button)
    .expect(page.popoverTitle.visible).ok()
    .expect(page.popoverTitle.textContent).eql('Popover title')

  // Check links with tooltips.
  await t
    .expect(page.tooltip.count).eql(0)
    .hover(page.modalDialog.linkWithTopTooltip)
    .expect(page.tooltip.count).eql(1)
    .expect(page.tooltip.textContent).eql('Tooltip on top')
    .hover(page.tooltip)
    .expect(page.tooltip.count).eql(0)

    .hover(page.modalDialog.linkWithBottomTooltip)
    .expect(page.tooltip.count).eql(1)
    .expect(page.tooltip.textContent).eql('Tooltip on bottom')
    .hover(page.tooltip)
    .expect(page.tooltip.count).eql(0)

  // Check accordion
  const accordion = page.modalDialog.accordion

  await t
    .expect(accordion.card(0).block.offsetHeight).gt(0)
    .expect(accordion.card(1).block.offsetHeight).eql(0)
    .click(accordion.card(1).header)
    .expect(accordion.card(0).block.offsetHeight).eql(0)
    .expect(accordion.card(1).block.offsetHeight).gt(0)
    .click(accordion.card(0).header)
    .expect(accordion.card(0).block.offsetHeight).gt(0)
    .expect(accordion.card(1).block.offsetHeight).eql(0)

  // Close modal dialog
  await t
    .click(page.modalDialog.saveButton)
})

test('Demonstrate Modal page is not closed issue', async (t) => {
  // Open and close dialog. It works
  await page.openDialog(t)
  await t
    .click(page.modalDialog.closeButton)
    .expect(page.modalDialog.isVisible()).notOk()

  // Open modal dialog and show a tooltip
  await page.openDialog(t)
  await t
    .hover(page.modalDialog.linkWithTopTooltip)
    .expect(page.tooltip.count).eql(1)

  // Close the modal dialog. It doesn't work now
  await t
    .click(page.modalDialog.closeButton)
    .expect(page.modalDialog.isVisible()).notOk('Modal dialog is not closed here')
})
