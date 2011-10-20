/* ============================================================
 * bootstrap-dropdown.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#dropdown
 * ============================================================
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
 * ============================================================ */


(function( $ ){

  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */
  var selector = '[data-dropdown]'

  function clearMenus() {
    $(selector).parent('li').removeClass('open')
  }

  $(function () {
    $('html').bind("click", clearMenus)
    $('body').delegate(selector, 'click', function (e) {
      var li = $(this).parent('li')
        , isActive = li.hasClass('open')
      clearMenus()
      !isActive && li.toggleClass('open')
      return false
    })
  })

})( window.jQuery || window.ender )