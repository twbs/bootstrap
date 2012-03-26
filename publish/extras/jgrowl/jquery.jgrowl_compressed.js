(function($){
$.jGrowl=function(m,o){
if($("#jGrowl").size()==0){
$("<div id=\"jGrowl\"></div>").addClass((o&&o.position)?o.position:$.jGrowl.defaults.position).appendTo("body");
}
$("#jGrowl").jGrowl(m,o);
};
$.fn.jGrowl=function(m,o){
if($.isFunction(this.each)){
var _6=arguments;
return this.each(function(){
var _7=this;
if($(this).data("jGrowl.instance")==undefined){
$(this).data("jGrowl.instance",$.extend(new $.fn.jGrowl(),{notifications:[],element:null,interval:null}));
$(this).data("jGrowl.instance").startup(this);
}
if($.isFunction($(this).data("jGrowl.instance")[m])){
$(this).data("jGrowl.instance")[m].apply($(this).data("jGrowl.instance"),$.makeArray(_6).slice(1));
}else{
$(this).data("jGrowl.instance").create(m,o);
}
});
}
};
$.extend($.fn.jGrowl.prototype,{defaults:{pool:0,header:"",group:"",sticky:false,position:"top-right",glue:"after",theme:"default",themeState:"highlight",corners:"10px",check:250,life:3000,closeDuration:"normal",openDuration:"normal",easing:"swing",closer:true,closeTemplate:"&times;",closerTemplate:"<div>[ close all ]</div>",log:function(e,m,o){
},beforeOpen:function(e,m,o){
},afterOpen:function(e,m,o){
},open:function(e,m,o){
},beforeClose:function(e,m,o){
},close:function(e,m,o){
},animateOpen:{opacity:"show"},animateClose:{opacity:"hide"}},notifications:[],element:null,interval:null,create:function(_1a,o){
var o=$.extend({},this.defaults,o);
if(typeof o.speed!=="undefined"){
o.openDuration=o.speed;
o.closeDuration=o.speed;
}
this.notifications.push({message:_1a,options:o});
o.log.apply(this.element,[this.element,_1a,o]);
},render:function(_1c){
var _1d=this;
var _1e=_1c.message;
var o=_1c.options;
var _1c=$("<div class=\"jGrowl-notification "+o.themeState+" ui-corner-all"+((o.group!=undefined&&o.group!="")?" "+o.group:"")+"\">"+"<div class=\"jGrowl-close\">"+o.closeTemplate+"</div>"+"<div class=\"jGrowl-header\">"+o.header+"</div>"+"<div class=\"jGrowl-message\">"+_1e+"</div></div>").data("jGrowl",o).addClass(o.theme).children("div.jGrowl-close").bind("click.jGrowl",function(){
$(this).parent().trigger("jGrowl.close");
}).parent();
$(_1c).bind("mouseover.jGrowl",function(){
$("div.jGrowl-notification",_1d.element).data("jGrowl.pause",true);
}).bind("mouseout.jGrowl",function(){
$("div.jGrowl-notification",_1d.element).data("jGrowl.pause",false);
}).bind("jGrowl.beforeOpen",function(){
if(o.beforeOpen.apply(_1c,[_1c,_1e,o,_1d.element])!=false){
$(this).trigger("jGrowl.open");
}
}).bind("jGrowl.open",function(){
if(o.open.apply(_1c,[_1c,_1e,o,_1d.element])!=false){
if(o.glue=="after"){
$("div.jGrowl-notification:last",_1d.element).after(_1c);
}else{
$("div.jGrowl-notification:first",_1d.element).before(_1c);
}
$(this).animate(o.animateOpen,o.openDuration,o.easing,function(){
if($.browser.msie&&(parseInt($(this).css("opacity"),10)===1||parseInt($(this).css("opacity"),10)===0)){
this.style.removeAttribute("filter");
}
$(this).data("jGrowl").created=new Date();
$(this).trigger("jGrowl.afterOpen");
});
}
}).bind("jGrowl.afterOpen",function(){
o.afterOpen.apply(_1c,[_1c,_1e,o,_1d.element]);
}).bind("jGrowl.beforeClose",function(){
if(o.beforeClose.apply(_1c,[_1c,_1e,o,_1d.element])!=false){
$(this).trigger("jGrowl.close");
}
}).bind("jGrowl.close",function(){
$(this).data("jGrowl.pause",true);
$(this).animate(o.animateClose,o.closeDuration,o.easing,function(){
$(this).remove();
var _20=o.close.apply(_1c,[_1c,_1e,o,_1d.element]);
if($.isFunction(_20)){
_20.apply(_1c,[_1c,_1e,o,_1d.element]);
}
});
}).trigger("jGrowl.beforeOpen");
if(o.corners!=""&&$.fn.corner!=undefined){
$(_1c).corner(o.corners);
}
if($("div.jGrowl-notification:parent",_1d.element).size()>1&&$("div.jGrowl-closer",_1d.element).size()==0&&this.defaults.closer!=false){
$(this.defaults.closerTemplate).addClass("jGrowl-closer ui-state-highlight ui-corner-all").addClass(this.defaults.theme).appendTo(_1d.element).animate(this.defaults.animateOpen,this.defaults.speed,this.defaults.easing).bind("click.jGrowl",function(){
$(this).siblings().trigger("jGrowl.beforeClose");
if($.isFunction(_1d.defaults.closer)){
_1d.defaults.closer.apply($(this).parent()[0],[$(this).parent()[0]]);
}
});
}
},update:function(){
$(this.element).find("div.jGrowl-notification:parent").each(function(){
if($(this).data("jGrowl")!=undefined&&$(this).data("jGrowl").created!=undefined&&($(this).data("jGrowl").created.getTime()+parseInt($(this).data("jGrowl").life))<(new Date()).getTime()&&$(this).data("jGrowl").sticky!=true&&($(this).data("jGrowl.pause")==undefined||$(this).data("jGrowl.pause")!=true)){
$(this).trigger("jGrowl.beforeClose");
}
});
if(this.notifications.length>0&&(this.defaults.pool==0||$(this.element).find("div.jGrowl-notification:parent").size()<this.defaults.pool)){
this.render(this.notifications.shift());
}
if($(this.element).find("div.jGrowl-notification:parent").size()<2){
$(this.element).find("div.jGrowl-closer").animate(this.defaults.animateClose,this.defaults.speed,this.defaults.easing,function(){
$(this).remove();
});
}
},startup:function(e){
this.element=$(e).addClass("jGrowl").append("<div class=\"jGrowl-notification\"></div>");
this.interval=setInterval(function(){
$(e).data("jGrowl.instance").update();
},parseInt(this.defaults.check));
if($.browser.msie&&parseInt($.browser.version)<7&&!window["XMLHttpRequest"]){
$(this.element).addClass("ie6");
}
},shutdown:function(){
$(this.element).removeClass("jGrowl").find("div.jGrowl-notification").remove();
clearInterval(this.interval);
},close:function(){
$(this.element).find("div.jGrowl-notification").each(function(){
$(this).trigger("jGrowl.beforeClose");
});
}});
$.jGrowl.defaults=$.fn.jGrowl.prototype.defaults;
})(jQuery);

