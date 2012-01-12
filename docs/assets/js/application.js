$(function(){

  // NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
  // IT'S ALL JUST JUNK FOR OUR DOCS!
  // ++++++++++++++++++++++++++++++++++++++++++


  // Hide the Mobile Safari address bar once loaded
  // ==============================================

  // Set a timeout...
  // setTimeout(function(){
  //   // Hide the address bar!
  //   window.scrollTo(0, 1);
  // }, 0);


  // table sort example
  // ==================

  // make code pretty
  window.prettyPrint && prettyPrint()

  // table sort example
  if ($.fn.tableSorter) {
    $("#sortTableExample").tablesorter( { sortList: [[ 1, 0 ]] } )
  }

  // add on logic
  $('.add-on :checkbox').on('click', function () {
    var $this = $(this)
      , method = $this.attr('checked') ? 'addClass' : 'removeClass'
    $(this).parents('.add-on')[method]('active')
  })

  // Disable certain links in docs
  // Please do not carry these styles over to your projects
  // it's merely here to prevent button clicks form taking you
  // away from your spot on page!!

  $('[href^=#]').click(function (e) {
    e.preventDefault()
  })

  // Copy code blocks in docs
  $(".copy-code").on('focus', function () {
    var el = this
    setTimeout(function () { $(el).select() }, 0)
  })

  if ($.fn.tooltip) {

    // position static twipsies for components page
    if ($(".twipsies a").length) {
      $(window).on('load resize', function () {
        $(".twipsies a").each(function () {
          $(this)
            .tooltip({
              placement: $(this).attr('title')
            , trigger: 'manual'
            })
            .tooltip('show')
          })
      })
    }

    // add tipsies to grid for scaffolding
    if ($('#grid-system').length) {

      $('#grid-system').tooltip({
          selector: '.show-grid > div'
        , title: function () { return $(this).width() + 'px' }
      })

    }
  }

  // javascript build logic

  var inputs = $("#javascript input")

  // toggle all plugin checkboxes
  $('#selectAll').on('click', function (e) {
    e.preventDefault()
    inputs.attr('checked', !inputs.is(':checked'))
  })

  // handle build button dropdown
  var buildTypes = $('#javascriptBuilder .dropdown-menu li').on('click', function () {
    buildTypes.removeClass('active')
    $(this).addClass('active')
  })

  // request built javascript
  $('#javascriptBuild').on('click', function () {

    var names = $("#javascript input:checked")
      .map(function () { return this.value })
      .toArray()

    if (names[names.length - 1] == 'bootstrap-transition.js') {
      names.unshift(names.pop())
    }

    $.ajax({
      type: 'POST'
    , dataType: 'jsonpi'
    , params: {
        branch: '2.0-wip'
      , dir: 'js'
      , filenames: names
      , compress: buildTypes.first().hasClass('active')
      }
    , url: "http://bootstrap.herokuapp.com"
    })
  })

})


// Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
// by the talented Ben Vinegar
!function($) {
    $.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
        var url = opts.url;

        return {
            send: function(_, completeCallback) {
                var name = 'jQuery_iframe_' + jQuery.now(),
                    iframe, form;

                iframe = $('<iframe>')
                    .attr('name', name)
                    .appendTo('head');

                form = $('<form>')
                    .attr('method', opts.type) // GET or POST
                    .attr('action', url)
                    .attr('target', name);

                $.each(opts.params, function(k, v) {
                    $('<input>')
                        .attr('type', 'hidden')
                        .attr('name', k)
                        .attr('value', v)
                        .appendTo(form);
                });

                form.appendTo('body').submit();
            }
       };
    });
}(jQuery);