/*!
 * AnchorJS - v0.4.0 - 2015-04-20
 * https://github.com/bryanbraun/anchorjs
 * Copyright (c) 2015 Bryan Braun; Licensed MIT
 */

function addAnchors(selector) {
  'use strict';

  // Sensible default selector, if none is provided.
  if (!selector) {
    selector = 'h1, h2, h3, h4, h5, h6';
  } else if (typeof selector !== 'string') {
    throw new Error('AnchorJS accepts only strings; you used a ' + typeof selector);
  }

  // Select any elements that match the provided selector.
  var elements = document.querySelectorAll(selector);
  if (elements.length === 0) {
    // Selector was valid but no elements were found.
    return false;
  }

  // Produce a list of existing IDs so we don't generate a duplicate.
  var elsWithIds = document.querySelectorAll('[id]');
  var idList = [].map.call(elsWithIds, function assign(el) {
    return el.id;
  });

  // Loop through the selected elements.
  for (var i = 0; i < elements.length; i++) {
    var elementID;

    if (elements[i].hasAttribute('id')) {
      elementID = elements[i].getAttribute('id');
    } else {
      // We need to create an ID on our element. First, we find which text
      // selection method is available to the browser.
      var textMethod = document.body.textContent ? 'textContent' : 'innerText';

      // Get the text inside our element
      var roughText = elements[i][textMethod];

      // Refine it so it makes a good ID. Strip out non-safe characters, replace
      // spaces with hyphens, truncate to 32 characters, and make toLowerCase.
      //
      // Example string:                                 // "⚡⚡⚡ Unicode icons are cool--but don't belong in a URL."
      var tidyText = roughText.replace(/[^\w\s-]/gi, '') // " Unicode icons are cool--but dont belong in a URL"
                              .replace(/\s+/g, '-')      // "-Unicode-icons-are-cool--but-dont-belong-in-a-URL"
                              .replace(/-{2,}/g, '-')    // "-Unicode-icons-are-cool-but-dont-belong-in-a-URL"
                              .substring(0, 32)          // "-Unicode-icons-are-cool-but-dont"
                              .replace(/^-+|-+$/gm, '')  // "Unicode-icons-are-cool-but-dont"
                              .toLowerCase();            // "unicode-icons-are-cool-but-dont"

      // Compare our generated ID to existing IDs (and increment it if needed)
      // before we add it to the page.
      var index,
          count = 0,
          newTidyText = tidyText;
      do {
        if (index !== undefined) {
          newTidyText = tidyText + '-' + count;
        }
        // .indexOf is supported in IE9+.
        index = idList.indexOf(newTidyText);
        count += 1;
      } while (index !== -1);
      index = undefined;
      idList.push(newTidyText);

      // Assign it to our element.
      // Currently the setAttribute element is only supported in IE9 and above.
      elements[i].setAttribute('id', newTidyText);

      // Grab it for use in our anchor.
      elementID = newTidyText;
    }

    var readableID = elementID.replace(/-/g, ' ');
    var anchor = '<a class="anchorjs-link" href="#' + elementID + '">' +
                    '<span class="anchorjs-description">Anchor link for: ' + readableID + '</span>' +
                    '<span class="anchorjs-icon" aria-hidden="true"></span>' +
                 '</a>';

    elements[i].innerHTML += anchor;
  }
}
