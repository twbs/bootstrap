import 'popper.js'
import $ from 'jquery'
import bootstrap from '../../../dist/js/bootstrap'

$(() => {
  $('#resultUID').text(bootstrap.Util.getUID('bs'))
  $('[data-toggle="tooltip"]').tooltip()
})
