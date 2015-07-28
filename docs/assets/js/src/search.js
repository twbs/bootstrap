/* global jQuery */

(function ($) {
  'use strict';

  function suggestionTemplate(hit) {
    var html = [];
    if (hit.grouped_by_page_header) {
      html.push('<div class="suggestion-page">' + hit.page + '</div>');
    }
    html.push('<div class="suggestion">');
    html.push('  <div class="suggestion-context">');
    if (hit.grouped_by_h1_header) {
      html.push(hit.h1);
    }
    html.push('  </div>');
    html.push('  <div class="suggestion-content">');
    html.push('    <div class="suggestion-title">');
    if (hit.h1_highlight) {
      html.push('      <span class="suggestion-title-prefix">' + hit.h1_highlight + '</span>');
    }
    if (hit.title) {
      html.push('      <span class="suggestion-title-hierarchy">' + hit.title + '</span>');
    }
    html.push('    </div>');
    if (hit.text) {
      html.push('    <div class="suggestion-text">' + hit.text + '</div>');
    }
    html.push('  </div>');
    html.push('</div>');
    return html.join('');
  }
  function footerTemplate() {
    return [
      '<a href="http://www.algolia.com/?utm_source=bootstrap&amp;utm_medium=link&amp;utm_campaign=bootstrap_documentation_search" target="_blank" class="search-footer text-hide">',
        'Powered by Algolia',
      '</a>'
    ].join('');
  }
  var $searchInput = $('.bs-docs-nav .bs-search .form-control')
  var typeaheadOptions = {
    hint: false,
    autoselect: true // This feature is not documented in typeahead doc
  }

  // Typeahead dataset source
  function datasetSource(query, callback) {
    // lightweight Algolia query
    var params = {
      query: query,
      'x-algolia-api-key': 'b107a5216b65db8915163e97bdc28234',
      'x-algolia-application-id': 'NNYOET9BZD',
      hitsPerPage: 5
    }
    // several hostnames for fault-tolerance
    var hosts = ['dsn.algolia.net', '1.algolianet.com', '2.algolianet.com', '3.algolianet.com'];
    (function query(retry) {
      if (retry >= hosts.length) {
        callback([]);
        return;
      }
      var url = 'https://NNYOET9BZD-' + hosts[retry] + '/1/indexes/bootstrap';
      $.ajax({ url: url, data: params, timeout: (2000 * (retry + 1)) }).then(function done(content) {
        callback(reorderResults(content.hits));
      }, function err() {
        query(retry + 1);
      });
    })(0);
  }

  // Helper to get the value of an attribute, with optional highlight
  function getValue(item, key, options) {
    options = $.extend({}, { highlight: false }, options)
    if (options.highlight) {
      return item._highlightResult[key].value
    }
    return item[key]
  }

  // Return a nice readable title for each record
  // h1: 'Go to {h1}'
  // h2 through h6: '{parent_hierarchy} › {self}'
  // p: '{parent_hierarchy}'
  function getTitle(item, options) {
    var tagName = item.tag_name
    if (tagName === 'h1') {
      return 'Go to ' + getValue(item, 'text', options)
    }

    // Building the heading hierarchy
    var hierarchy = []
    $.each(['h2', 'h3', 'h4', 'h5', 'h6'], function (index, key) {
      if (!item[key]) {
        return
      }
      hierarchy.push(getValue(item, key, options))
    })

    return hierarchy.join(' › ')
  }

  // Return the snippet including ellipsis
  function getText(item) {
    if (item.tag_name !== 'p') {
      return null
    }
    var text = item._snippetResult.text.value

    // Does not start with an uppercase, so it was cut at the start
    if (text[0] !== text[0].toUpperCase()) {
      text = '…' + text
    }
    // Does not end with a period, so it was cut at the end
    if (text.slice(-1) !== '.') {
      text = text + '…'
    }
    return text
  }

  var dataset = {
    // Disable update of the input field when using keyboard
    displayKey: function () {
      return $searchInput.val()
    },
    source: datasetSource,
    templates: {
      suggestion: function (item) {
        return suggestionTemplate(item)
      },
      footer: function () {
        return footerTemplate()
      }
    }
  }

  // Group items by attribute, keeping said attribute only on the first one
  function groupBy(results, attribute) {
    var groupedResults = {}
    $.each(results, function (index, result) {
      var value = result[attribute]
      if (!groupedResults[value]) {
        result['grouped_by_' + attribute + '_header'] = true
        groupedResults[value] = [result]
        return
      }
      groupedResults[value].push(result)
    })
    return groupedResults
  }

  // Reorder results to group them by page and title
  function reorderResults(results) {
    // We filter the data we actually need from the results
    results = $.map(results, function (result) {
      return {
        page: result.title,
        h1: result.h1,
        h1_highlight: result._highlightResult.h1.value,
        title: getTitle(result, { highlight: true }),
        raw_title: getTitle(result, { highlight: false }),
        text: getText(result),
        url: result.url,
        // This one is for debug
        _original: result
      }
    })

    var groupedByPage = groupBy(results, 'page')
    var formattedResults = []
    $.each(groupedByPage, function (title, titleResults) {
      var groupedByH1 = groupBy(titleResults, 'h1')
      $.each(groupedByH1, function (h1, h1Results) {
        formattedResults = formattedResults.concat(h1Results)
      })
    })
    return formattedResults
  }

  function goToSuggestion(event, item) {
    $searchInput.typeahead('val', '')
    window.location.href = item.url
  }

  // Init typeahead
  $(function () {
    $('.bs-docs-nav.bs-no-js').removeClass('bs-no-js')
    $searchInput.typeahead(typeaheadOptions, dataset)
                .bind('typeahead:selected', goToSuggestion)

    // Toggle and focus input field when clicking on label
    // Note: We need to replicate the default HTML behavior on labels using the
    // `for` attribute as we also need to focus the input and iOS only accepts
    // focus calls when they come from a user interaction
    var $toggleCheckbox = $('#bs-toggle-search')
    var $toggleLabels = $('.bs-toggle-search-open')
    $toggleLabels.on('click', function (e) {
      $toggleCheckbox.click()
      $searchInput.focus()
      e.preventDefault()
    })

    // Fixing some default typeahead CSS not playing nicely with the navbar
    var $typeaheadWrapper = $searchInput.parent()
    var $typeaheadDropdown = $searchInput.nextAll('.tt-dropdown-menu')
    $typeaheadWrapper.css('display', 'block')
    $typeaheadDropdown.css('top', $searchInput.outerHeight() + 'px')
  })
})(jQuery)
