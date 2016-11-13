$(document).ready(() => {
  $('.tooltip-right').tooltip({
    placement: 'right',
    textdir: 'rtl',
    viewport: {
      selector: 'body',
      padding: 2
    }
  })

  $('#popover').popover({
    textdir: 'rtl'
  })
})
