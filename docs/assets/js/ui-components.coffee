---
---

if $('#datatable').length
  $('#datatable').DataTable()

class ResponsiveLayout
  constructor: (@$dom)->
    do @eventBinding


  toggleActive: ($element)->
    active_type = $element.data('layout-switch')
    current_active = @$dom.attr('data-active')
    if current_active is active_type
      active_type = ''
    @$dom.attr('data-active', active_type)

  eventBinding: ->
    if @$dom.not('.res-single-column, .res-two-columns').length
      @$dom.on 'click touchend', '[data-layout-switch]', (e)=>
        $el = $(e.currentTarget)
        @toggleActive($el)

    if @$dom.not('.res-single-column').length
      $(document).on 'click touchend', ".res-layout[data-active='navigation'] *:not(.res-navigation)", (e)=>
        e.stopPropagation()
        $el = $(e.currentTarget)
        in_navigation = $el.closest('.res-navigation').length
        if $(e.currentTarget).is('[data-layout-switch]')
          return true
        else if !in_navigation
          @$dom.attr('data-active', '')

if $('.res-layout').length
  new ResponsiveLayout($('.res-layout'))

$('.section-datepicker').find('#datepicker').datepicker
  orientation: "auto"
$('.section-sortable').find('.sortable').sortable()

