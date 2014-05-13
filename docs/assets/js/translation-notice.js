---
layout: nil
---
// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++
/*!
 * Copyright 2011-2014 Twitter, Inc.
 *
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */
!function ($) {

  var alreadyDismissed = localStorage.getItem('bs.dismissedTranslationNotice') === 'true'
  var language = navigator.language || navigator.userLanguage
  var translations = {
    {% for language in site.data.translations %}
    {{ language.code }}: {
      name: '{{ language.name }}',
      url: '{{ language.url }}'
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  }

  if (!alreadyDismissed && language && language.substring(0, 2) in translations) {
    var translation = translations[language]
    translation.name = $('<div/>').text(translation.name).html()
    var template = '<div class="alert alert-info js-translation-notice">' +
      '<h4>' + translation.name + ' translation of this documentation available</h4>' +
      '<p>We want to let you know that you can read this documentation in ' + translation.name + '!</p>' +
      '<p><small>Please note that this translation has been authored by a third party and may not be up to date.</small></p>' +
      '<p>' +
        '<a class="btn btn-primary" href="' + translation.url + '">Open ' + translation.name + ' translation</a> ' +
        '<button type="button" class="btn btn-default" data-dismiss="alert" data-target=".js-translation-notice">Don\'t show me this again</button>' +
      '</p>' +
    '</div>'

    $(template)
      .insertBefore('.bs-docs-section:first')
      .alert()
      .on('close.bs.alert', function () {
        localStorage.setItem('bs.dismissedTranslationNotice', 'true')
      })
  }

}(jQuery)