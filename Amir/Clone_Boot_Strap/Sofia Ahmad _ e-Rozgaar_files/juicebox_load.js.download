/**
 * @file
 * Attaches the behaviors for the Juicebox module.
 */

(function ($) {
  Drupal.behaviors.juicebox = {
    attach: function (context, settings) {
      if (typeof settings['juicebox'] !== 'undefined') {
        var galleries = settings['juicebox'];
        // Loop-through galleries that were added during this request.
        for (var key in galleries) {
          if (galleries.hasOwnProperty(key)) {
            // Instantiate each new gallery via the library. Take a copy to be
            // safe as we will delete the original settings reference after.
            var newGallery = $.extend({}, galleries[key]);
            new juicebox(newGallery);
            // We only want to hold on to the settings for this gallery long
            // enough to pass it on as a proper Juicebox object. In fact,
            // holding on longer can cause problems on sequential AJAX updates
            // of the same gallery, so it's probably best to delete it.
            delete galleries[key];
          }
        }
      }
    }
  };
})(jQuery);