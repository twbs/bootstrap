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
      @$dom.on 'click', '[data-layout-switch]', (e)=>
        $el = $(e.currentTarget)
        @toggleActive($el)

    if @$dom.not('.res-single-column').length
      $(document).on 'click', ".res-layout[data-active='navigation'] *:not(.res-navigation)", (e)=>
        e.stopPropagation()
        $el = $(e.currentTarget)
        if $(e.currentTarget).is('[data-layout-switch]')
          return true
        else
          @$dom.attr('data-active', '')

if $('.res-layout').length
  new ResponsiveLayout($('.res-layout'))


