/* ==========================================================
 * bootstrap-alerts.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2011 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

(function( $ ){

 /* ALERT CLASS DEFINITION
  * ====================== */

  function close(e) {
    var $element = $(this).parent('.alert-message')

    e && e.preventDefault()
    $element.removeClass('in')

    function removeElement () {
      $element.remove()
    }

    $.support.transition && $element.hasClass('fade') ?
      $element.bind($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $(function () {
    $('body').delegate('[data-alert-dismiss]', 'click', close)
  })

})( window.jQuery || window.ender )