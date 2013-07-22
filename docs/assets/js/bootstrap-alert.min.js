/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
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
 * ========================================================== */!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;if(!r){r=n.attr("href");r=r&&r.replace(/.*(?=#[^\s]*$)/,"")}i=e(r);t&&t.preventDefault();i.length||(i=n.hasClass("alert")?n:n.parent());i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in");e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()};var r=e.fn.alert;e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this));typeof t=="string"&&i[t].call(r)})};e.fn.alert.Constructor=n;e.fn.alert.noConflict=function(){e.fn.alert=r;return this};e(document).on("click.alert.data-api",t,n.prototype.close)}(window.jQuery);