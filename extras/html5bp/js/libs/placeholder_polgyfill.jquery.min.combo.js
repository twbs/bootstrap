/**
 * Copyright (c) 2008 Tom Deater (http://www.tomdeater.com)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */
jQuery.onFontResize=(function(a){a(document).ready(function(){var c=a("<iframe />").attr("id","frame-onFontResize"+Date.parse(new Date)).addClass("div-onfontresize").css({width:"100em",height:"10px",position:"absolute",borderWidth:0,top:"-5000px",left:"-5000px"}).appendTo("body");
if(a.browser.msie){c.bind("resize",function(){a.onFontResize.trigger(c[0].offsetWidth/100);});}else{var b=c[0].contentWindow||c[0].contentDocument||c[0].document;
b=b.document||b;b.open();b.write('<script>window.onload = function(){var em = parent.jQuery(".div-onfontresize")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};<\/script>');
b.close();}});return{trigger:function(b){a(document).trigger("fontresize",[b]);}};})(jQuery);

/**
* HTML5 placeholder polyfill
*
* code: https://github.com/ginader/HTML5-placeholder-polyfill
* please report issues at: https://github.com/ginader/HTML5-placeholder-polyfill/issues
*
* Copyright (c) 2012 Dirk Ginader (ginader.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Version: 1.9
*/
(function(e){var a=false,h;function b(k,l){if(e.trim(k.val())===""){k.data("placeholder").removeClass(l.hideClass);}else{k.data("placeholder").addClass(l.hideClass);
}}function f(k,l){k.data("placeholder").addClass(l.hideClass);}function g(m,l){var k=l.is("textarea");m.css({width:l.innerWidth()-(k?20:4),height:l.innerHeight()-6,lineHeight:l.css("line-height"),whiteSpace:k?"normal":"nowrap",overflow:"hidden"}).offset(l.offset());
}function c(k,l){var k=k,m=k.val();(function n(){h=requestAnimationFrame(n);if(k.val()!=m){f(k,l);j();i(k,l);}})();}function i(k,l){var k=k,m=k.val();(function n(){h=requestAnimationFrame(n);
b(k,l);})();}function j(){cancelAnimationFrame(h);}function d(k){if(a&&window.console&&window.console.log){window.console.log(k);}}e.fn.placeHolder=function(k){var l=this;
this.options=e.extend({className:"placeholder",visibleToScreenreaders:true,visibleToScreenreadersHideClass:"placeholder-hide-exept-screenreader",visibleToNoneHideClass:"placeholder-hide",hideOnFocus:true},k);
this.options.hideClass=this.options.visibleToScreenreaders?this.options.visibleToScreenreadersHideClass:this.options.visibleToNoneHideClass;return e(this).each(function(){var m=e(this),q=m.attr("placeholder"),r=m.attr("id"),n,p,o;
n=m.closest("label")[0];m.attr("placeholder","");if(!n&&!r){d("the input element with the placeholder needs an id!");return;}n=n||e('label[for="'+r+'"]');
if(!n){d("the input element with the placeholder needs a label!");return;}if(e(n).hasClass("visuallyhidden")){e(n).removeClass("visuallyhidden").addClass("visuallyhidden-with-placeholder");
}p=e('<span class="'+l.options.className+'">'+q+"</span>").appendTo(n);o=(p.width()>m.width());if(o){p.attr("title",q);}g(p,m);m.data("placeholder",p);
p.data("input",p);p.click(function(){e(this).data("input").focus();});m.focusin(function(){if(!l.options.hideOnFocus&&window.requestAnimationFrame){c(m,l.options);
}else{f(m,l.options);}});m.focusout(function(){b(e(this),l.options);if(!l.options.hideOnFocus&&window.cancelAnimationFrame){j();}});b(m,l.options);e(document).bind("fontresize",function(){g(p,m);
});if(e.event.special.resize){e("textarea").bind("resize",function(s){g(p,m);});}else{e("textarea").css("resize","none");}});};e(function(){if("placeholder" in e("<input>")[0]){return;
}e("input[placeholder], textarea[placeholder]").placeHolder({visibleToScreenreaders:true,hideOnFocus:false});});})(jQuery);