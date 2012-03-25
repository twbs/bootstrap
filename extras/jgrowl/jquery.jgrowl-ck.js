/**
 * jGrowl 1.2.5
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Written by Stan Lemon <stosh1985@gmail.com>
 * Last updated: 2009.12.15
 *
 * jGrowl is a jQuery plugin implementing unobtrusive userland notifications.  These 
 * notifications function similarly to the Growl Framework available for
 * Mac OS X (http://growl.info).
 *
 * To Do:
 * - Move library settings to containers and allow them to be changed per container
 *
 * Changes in 1.2.5
 * - Changed wrapper jGrowl's options usage to "o" instead of $.jGrowl.defaults
 * - Added themeState option to control 'highlight' or 'error' for jQuery UI
 * - Ammended some CSS to provide default positioning for nested usage.
 * - Changed some CSS to be prefixed with jGrowl- to prevent namespacing issues
 * - Added two new options - openDuration and closeDuration to allow 
 *   better control of notification open and close speeds, respectively 
 *   Patch contributed by Jesse Vincet.
 * - Added afterOpen callback.  Patch contributed by Russel Branca.
 *
 * Changes in 1.2.4
 * - Fixed IE bug with the close-all button
 * - Fixed IE bug with the filter CSS attribute (special thanks to gotwic)
 * - Update IE opacity CSS
 * - Changed font sizes to use "em", and only set the base style
 *
 * Changes in 1.2.3
 * - The callbacks no longer use the container as context, instead they use the actual notification
 * - The callbacks now receive the container as a parameter after the options parameter
 * - beforeOpen and beforeClose now check the return value, if it's false - the notification does
 *   not continue.  The open callback will also halt execution if it returns false.
 * - Fixed bug where containers would get confused
 * - Expanded the pause functionality to pause an entire container.
 *
 * Changes in 1.2.2
 * - Notification can now be theme rolled for jQuery UI, special thanks to Jeff Chan!
 *
 * Changes in 1.2.1
 * - Fixed instance where the interval would fire the close method multiple times.
 * - Added CSS to hide from print media
 * - Fixed issue with closer button when div { position: relative } is set
 * - Fixed leaking issue with multiple containers.  Special thanks to Matthew Hanlon!
 *
 * Changes in 1.2.0
 * - Added message pooling to limit the number of messages appearing at a given time.
 * - Closing a notification is now bound to the notification object and triggered by the close button.
 *
 * Changes in 1.1.2
 * - Added iPhone styled example
 * - Fixed possible IE7 bug when determining if the ie6 class shoudl be applied.
 * - Added template for the close button, so that it's content could be customized.
 *
 * Changes in 1.1.1
 * - Fixed CSS styling bug for ie6 caused by a mispelling
 * - Changes height restriction on default notifications to min-height
 * - Added skinned examples using a variety of images
 * - Added the ability to customize the content of the [close all] box
 * - Added jTweet, an example of using jGrowl + Twitter
 *
 * Changes in 1.1.0
 * - Multiple container and instances.
 * - Standard $.jGrowl() now wraps $.fn.jGrowl() by first establishing a generic jGrowl container.
 * - Instance methods of a jGrowl container can be called by $.fn.jGrowl(methodName)
 * - Added glue preferenced, which allows notifications to be inserted before or after nodes in the container
 * - Added new log callback which is called before anything is done for the notification
 * - Corner's attribute are now applied on an individual notification basis.
 *
 * Changes in 1.0.4
 * - Various CSS fixes so that jGrowl renders correctly in IE6.
 *
 * Changes in 1.0.3
 * - Fixed bug with options persisting across notifications
 * - Fixed theme application bug
 * - Simplified some selectors and manipulations.
 * - Added beforeOpen and beforeClose callbacks
 * - Reorganized some lines of code to be more readable
 * - Removed unnecessary this.defaults context
 * - If corners plugin is present, it's now customizable.
 * - Customizable open animation.
 * - Customizable close animation.
 * - Customizable animation easing.
 * - Added customizable positioning (top-left, top-right, bottom-left, bottom-right, center)
 *
 * Changes in 1.0.2
 * - All CSS styling is now external.
 * - Added a theme parameter which specifies a secondary class for styling, such
 *   that notifications can be customized in appearance on a per message basis.
 * - Notification life span is now customizable on a per message basis.
 * - Added the ability to disable the global closer, enabled by default.
 * - Added callbacks for when a notification is opened or closed.
 * - Added callback for the global closer.
 * - Customizable animation speed.
 * - jGrowl now set itself up and tears itself down.
 *
 * Changes in 1.0.1:
 * - Removed dependency on metadata plugin in favor of .data()
 * - Namespaced all events
 */(function(a){a.jGrowl=function(b,c){a("#jGrowl").size()==0&&a('<div id="jGrowl"></div>').addClass(c&&c.position?c.position:a.jGrowl.defaults.position).appendTo("body");a("#jGrowl").jGrowl(b,c)};a.fn.jGrowl=function(b,c){if(a.isFunction(this.each)){var d=arguments;return this.each(function(){var e=this;if(a(this).data("jGrowl.instance")==undefined){a(this).data("jGrowl.instance",a.extend(new a.fn.jGrowl,{notifications:[],element:null,interval:null}));a(this).data("jGrowl.instance").startup(this)}a.isFunction(a(this).data("jGrowl.instance")[b])?a(this).data("jGrowl.instance")[b].apply(a(this).data("jGrowl.instance"),a.makeArray(d).slice(1)):a(this).data("jGrowl.instance").create(b,c)})}};a.extend(a.fn.jGrowl.prototype,{defaults:{pool:0,header:"",group:"",sticky:!1,position:"top-right",glue:"after",theme:"default",themeState:"highlight",corners:"10px",check:250,life:3e3,closeDuration:"normal",openDuration:"normal",easing:"swing",closer:!0,closeTemplate:"&times;",closerTemplate:"<div>[ close all ]</div>",log:function(a,b,c){},beforeOpen:function(a,b,c){},afterOpen:function(a,b,c){},open:function(a,b,c){},beforeClose:function(a,b,c){},close:function(a,b,c){},animateOpen:{opacity:"show"},animateClose:{opacity:"hide"}},notifications:[],element:null,interval:null,create:function(b,c){var c=a.extend({},this.defaults,c);if(typeof c.speed!="undefined"){c.openDuration=c.speed;c.closeDuration=c.speed}this.notifications.push({message:b,options:c});c.log.apply(this.element,[this.element,b,c])},render:function(b){var c=this,d=b.message,e=b.options,b=a('<div class="jGrowl-notification '+e.themeState+" ui-corner-all"+(e.group!=undefined&&e.group!=""?" "+e.group:"")+'">'+'<div class="jGrowl-close">'+e.closeTemplate+"</div>"+'<div class="jGrowl-header">'+e.header+"</div>"+'<div class="jGrowl-message">'+d+"</div></div>").data("jGrowl",e).addClass(e.theme).children("div.jGrowl-close").bind("click.jGrowl",function(){a(this).parent().trigger("jGrowl.close")}).parent();a(b).bind("mouseover.jGrowl",function(){a("div.jGrowl-notification",c.element).data("jGrowl.pause",!0)}).bind("mouseout.jGrowl",function(){a("div.jGrowl-notification",c.element).data("jGrowl.pause",!1)}).bind("jGrowl.beforeOpen",function(){e.beforeOpen.apply(b,[b,d,e,c.element])!=0&&a(this).trigger("jGrowl.open")}).bind("jGrowl.open",function(){if(e.open.apply(b,[b,d,e,c.element])!=0){e.glue=="after"?a("div.jGrowl-notification:last",c.element).after(b):a("div.jGrowl-notification:first",c.element).before(b);a(this).animate(e.animateOpen,e.openDuration,e.easing,function(){a.browser.msie&&(parseInt(a(this).css("opacity"),10)===1||parseInt(a(this).css("opacity"),10)===0)&&this.style.removeAttribute("filter");a(this).data("jGrowl").created=new Date;a(this).trigger("jGrowl.afterOpen")})}}).bind("jGrowl.afterOpen",function(){e.afterOpen.apply(b,[b,d,e,c.element])}).bind("jGrowl.beforeClose",function(){e.beforeClose.apply(b,[b,d,e,c.element])!=0&&a(this).trigger("jGrowl.close")}).bind("jGrowl.close",function(){a(this).data("jGrowl.pause",!0);a(this).animate(e.animateClose,e.closeDuration,e.easing,function(){a(this).remove();var f=e.close.apply(b,[b,d,e,c.element]);a.isFunction(f)&&f.apply(b,[b,d,e,c.element])})}).trigger("jGrowl.beforeOpen");e.corners!=""&&a.fn.corner!=undefined&&a(b).corner(e.corners);a("div.jGrowl-notification:parent",c.element).size()>1&&a("div.jGrowl-closer",c.element).size()==0&&this.defaults.closer!=0&&a(this.defaults.closerTemplate).addClass("jGrowl-closer ui-state-highlight ui-corner-all").addClass(this.defaults.theme).appendTo(c.element).animate(this.defaults.animateOpen,this.defaults.speed,this.defaults.easing).bind("click.jGrowl",function(){a(this).siblings().trigger("jGrowl.beforeClose");a.isFunction(c.defaults.closer)&&c.defaults.closer.apply(a(this).parent()[0],[a(this).parent()[0]])})},update:function(){a(this.element).find("div.jGrowl-notification:parent").each(function(){a(this).data("jGrowl")!=undefined&&a(this).data("jGrowl").created!=undefined&&a(this).data("jGrowl").created.getTime()+parseInt(a(this).data("jGrowl").life)<(new Date).getTime()&&a(this).data("jGrowl").sticky!=1&&(a(this).data("jGrowl.pause")==undefined||a(this).data("jGrowl.pause")!=1)&&a(this).trigger("jGrowl.beforeClose")});this.notifications.length>0&&(this.defaults.pool==0||a(this.element).find("div.jGrowl-notification:parent").size()<this.defaults.pool)&&this.render(this.notifications.shift());a(this.element).find("div.jGrowl-notification:parent").size()<2&&a(this.element).find("div.jGrowl-closer").animate(this.defaults.animateClose,this.defaults.speed,this.defaults.easing,function(){a(this).remove()})},startup:function(b){this.element=a(b).addClass("jGrowl").append('<div class="jGrowl-notification"></div>');this.interval=setInterval(function(){a(b).data("jGrowl.instance").update()},parseInt(this.defaults.check));a.browser.msie&&parseInt(a.browser.version)<7&&!window.XMLHttpRequest&&a(this.element).addClass("ie6")},shutdown:function(){a(this.element).removeClass("jGrowl").find("div.jGrowl-notification").remove();clearInterval(this.interval)},close:function(){a(this.element).find("div.jGrowl-notification").each(function(){a(this).trigger("jGrowl.beforeClose")})}});a.jGrowl.defaults=a.fn.jGrowl.prototype.defaults})(jQuery);