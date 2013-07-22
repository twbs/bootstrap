/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#affix
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
 * ========================================================== */!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n);this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)).on("click.affix.data-api",e.proxy(function(){setTimeout(e.proxy(this.checkPosition,this),1)},this));this.$element=e(t);this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i);typeof o=="function"&&(o=i.top());typeof s=="function"&&(s=i.bottom());a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a;this.unpin=a=="bottom"?r.top-n:null;this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))};var n=e.fn.affix;e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s));typeof n=="string"&&i[n]()})};e.fn.affix.Constructor=t;e.fn.affix.defaults={offset:0};e.fn.affix.noConflict=function(){e.fn.affix=n;return this};e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{};n.offsetBottom&&(n.offset.bottom=n.offsetBottom);n.offsetTop&&(n.offset.top=n.offsetTop);t.affix(n)})})}(window.jQuery);