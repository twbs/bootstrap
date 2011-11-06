/* =============================================================
 * bootstrap-accordion.js v2.0.0
 * http://twitter.github.com/bootstrap/javascript.html#accordion
 * =============================================================
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

  var Accordion = function ( element, options ) {}

  Accordion.prototype = {}

  /* ALERT PLUGIN DEFINITION
   * ======================= */

  $.fn.accordion = function ( options ) {

    if ( options === true ) {
     return this.data('accordion')
    }

    return this.each(function () {
      new Accordion(this, options)
    })
  }


})( window.jQuery || window.ender )