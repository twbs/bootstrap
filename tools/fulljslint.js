// (C)2002 Douglas Crockford
// www.JSLint.com
// Rhino Edition
"use strict";var JSLINT=(function(){var adsafe_id,adsafe_may,adsafe_went,anonname,approved,atrule={media:true,'font-face':true,page:true},bang={'<':true,'<=':true,'==':true,'===':true,'!==':true,'!=':true,'>':true,'>=':true,'+':true,'-':true,'*':true,'/':true,'%':true},banned={'arguments':true,callee:true,caller:true,constructor:true,'eval':true,prototype:true,stack:true,unwatch:true,valueOf:true,watch:true},boolOptions={adsafe:true,bitwise:true,browser:true,cap:true,css:true,debug:true,devel:true,eqeqeq:true,es5:true,evil:true,forin:true,fragment:true,immed:true,laxbreak:true,newcap:true,nomen:true,on:true,onevar:true,passfail:true,plusplus:true,regexp:true,rhino:true,undef:true,safe:true,windows:true,strict:true,sub:true,white:true,widget:true},browser={addEventListener:false,blur:false,clearInterval:false,clearTimeout:false,close:false,closed:false,defaultStatus:false,document:false,event:false,focus:false,frames:false,getComputedStyle:false,history:false,Image:false,length:false,location:false,moveBy:false,moveTo:false,name:false,navigator:false,onbeforeunload:true,onblur:true,onerror:true,onfocus:true,onload:true,onresize:true,onunload:true,open:false,opener:false,Option:false,parent:false,print:false,removeEventListener:false,resizeBy:false,resizeTo:false,screen:false,scroll:false,scrollBy:false,scrollTo:false,setInterval:false,setTimeout:false,status:false,top:false,XMLHttpRequest:false},cssAttributeData,cssAny,cssColorData={"aliceblue":true,"antiquewhite":true,"aqua":true,"aquamarine":true,"azure":true,"beige":true,"bisque":true,"black":true,"blanchedalmond":true,"blue":true,"blueviolet":true,"brown":true,"burlywood":true,"cadetblue":true,"chartreuse":true,"chocolate":true,"coral":true,"cornflowerblue":true,"cornsilk":true,"crimson":true,"cyan":true,"darkblue":true,"darkcyan":true,"darkgoldenrod":true,"darkgray":true,"darkgreen":true,"darkkhaki":true,"darkmagenta":true,"darkolivegreen":true,"darkorange":true,"darkorchid":true,"darkred":true,"darksalmon":true,"darkseagreen":true,"darkslateblue":true,"darkslategray":true,"darkturquoise":true,"darkviolet":true,"deeppink":true,"deepskyblue":true,"dimgray":true,"dodgerblue":true,"firebrick":true,"floralwhite":true,"forestgreen":true,"fuchsia":true,"gainsboro":true,"ghostwhite":true,"gold":true,"goldenrod":true,"gray":true,"green":true,"greenyellow":true,"honeydew":true,"hotpink":true,"indianred":true,"indigo":true,"ivory":true,"khaki":true,"lavender":true,"lavenderblush":true,"lawngreen":true,"lemonchiffon":true,"lightblue":true,"lightcoral":true,"lightcyan":true,"lightgoldenrodyellow":true,"lightgreen":true,"lightpink":true,"lightsalmon":true,"lightseagreen":true,"lightskyblue":true,"lightslategray":true,"lightsteelblue":true,"lightyellow":true,"lime":true,"limegreen":true,"linen":true,"magenta":true,"maroon":true,"mediumaquamarine":true,"mediumblue":true,"mediumorchid":true,"mediumpurple":true,"mediumseagreen":true,"mediumslateblue":true,"mediumspringgreen":true,"mediumturquoise":true,"mediumvioletred":true,"midnightblue":true,"mintcream":true,"mistyrose":true,"moccasin":true,"navajowhite":true,"navy":true,"oldlace":true,"olive":true,"olivedrab":true,"orange":true,"orangered":true,"orchid":true,"palegoldenrod":true,"palegreen":true,"paleturquoise":true,"palevioletred":true,"papayawhip":true,"peachpuff":true,"peru":true,"pink":true,"plum":true,"powderblue":true,"purple":true,"red":true,"rosybrown":true,"royalblue":true,"saddlebrown":true,"salmon":true,"sandybrown":true,"seagreen":true,"seashell":true,"sienna":true,"silver":true,"skyblue":true,"slateblue":true,"slategray":true,"snow":true,"springgreen":true,"steelblue":true,"tan":true,"teal":true,"thistle":true,"tomato":true,"turquoise":true,"violet":true,"wheat":true,"white":true,"whitesmoke":true,"yellow":true,"yellowgreen":true},cssBorderStyle,cssBreak,cssLengthData={'%':true,'cm':true,'em':true,'ex':true,'in':true,'mm':true,'pc':true,'pt':true,'px':true},cssOverflow,devel={alert:false,confirm:false,console:false,Debug:false,opera:false,prompt:false},escapes={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','/':'\\/','\\':'\\\\'},funct,functionicity=['closure','exception','global','label','outer','unused','var'],functions,global,htmltag={a:{},abbr:{},acronym:{},address:{},applet:{},area:{empty:true,parent:' map '},article:{},aside:{},audio:{},b:{},base:{empty:true,parent:' head '},bdo:{},big:{},blockquote:{},body:{parent:' html noframes '},br:{empty:true},button:{},canvas:{parent:' body p div th td '},caption:{parent:' table '},center:{},cite:{},code:{},col:{empty:true,parent:' table colgroup '},colgroup:{parent:' table '},command:{parent:' menu '},datalist:{},dd:{parent:' dl '},del:{},details:{},dialog:{},dfn:{},dir:{},div:{},dl:{},dt:{parent:' dl '},em:{},embed:{},fieldset:{},figure:{},font:{},footer:{},form:{},frame:{empty:true,parent:' frameset '},frameset:{parent:' html frameset '},h1:{},h2:{},h3:{},h4:{},h5:{},h6:{},head:{parent:' html '},header:{},hgroup:{},hr:{empty:true},'hta:application':{empty:true,parent:' head '},html:{parent:'*'},i:{},iframe:{},img:{empty:true},input:{empty:true},ins:{},kbd:{},keygen:{},label:{},legend:{parent:' details fieldset figure '},li:{parent:' dir menu ol ul '},link:{empty:true,parent:' head '},map:{},mark:{},menu:{},meta:{empty:true,parent:' head noframes noscript '},meter:{},nav:{},noframes:{parent:' html body '},noscript:{parent:' body head noframes '},object:{},ol:{},optgroup:{parent:' select '},option:{parent:' optgroup select '},output:{},p:{},param:{empty:true,parent:' applet object '},pre:{},progress:{},q:{},rp:{},rt:{},ruby:{},samp:{},script:{empty:true,parent:' body div frame head iframe p pre span '},section:{},select:{},small:{},span:{},source:{},strong:{},style:{parent:' head ',empty:true},sub:{},sup:{},table:{},tbody:{parent:' table '},td:{parent:' tr '},textarea:{},tfoot:{parent:' table '},th:{parent:' tr '},thead:{parent:' table '},time:{},title:{parent:' head '},tr:{parent:' table tbody thead tfoot '},tt:{},u:{},ul:{},'var':{},video:{}},ids,implied,inblock,indent,jsonmode,lines,lookahead,member,membersOnly,nexttoken,noreach,option,predefined,prereg,prevtoken,rhino={defineClass:false,deserialize:false,gc:false,help:false,load:false,loadClass:false,print:false,quit:false,readFile:false,readUrl:false,runCommand:false,seal:false,serialize:false,spawn:false,sync:false,toint32:false,version:false},scope,windows={ActiveXObject:false,CScript:false,Debug:false,Enumerator:false,System:false,VBArray:false,WScript:false},src,stack,standard={Array:false,Boolean:false,Date:false,decodeURI:false,decodeURIComponent:false,encodeURI:false,encodeURIComponent:false,Error:false,'eval':false,EvalError:false,Function:false,hasOwnProperty:false,isFinite:false,isNaN:false,JSON:false,Math:false,Number:false,Object:false,parseInt:false,parseFloat:false,RangeError:false,ReferenceError:false,RegExp:false,String:false,SyntaxError:false,TypeError:false,URIError:false},standard_member={E:true,LN2:true,LN10:true,LOG2E:true,LOG10E:true,PI:true,SQRT1_2:true,SQRT2:true,MAX_VALUE:true,MIN_VALUE:true,NEGATIVE_INFINITY:true,POSITIVE_INFINITY:true},strict_mode,syntax={},tab,token,urls,warnings,widget={alert:true,animator:true,appleScript:true,beep:true,bytesToUIString:true,Canvas:true,chooseColor:true,chooseFile:true,chooseFolder:true,closeWidget:true,COM:true,convertPathToHFS:true,convertPathToPlatform:true,CustomAnimation:true,escape:true,FadeAnimation:true,filesystem:true,Flash:true,focusWidget:true,form:true,FormField:true,Frame:true,HotKey:true,Image:true,include:true,isApplicationRunning:true,iTunes:true,konfabulatorVersion:true,log:true,md5:true,MenuItem:true,MoveAnimation:true,openURL:true,play:true,Point:true,popupMenu:true,preferenceGroups:true,preferences:true,print:true,prompt:true,random:true,Rectangle:true,reloadWidget:true,ResizeAnimation:true,resolvePath:true,resumeUpdates:true,RotateAnimation:true,runCommand:true,runCommandInBg:true,saveAs:true,savePreferences:true,screen:true,ScrollBar:true,showWidgetPreferences:true,sleep:true,speak:true,Style:true,suppressUpdates:true,system:true,tellWidget:true,Text:true,TextArea:true,Timer:true,unescape:true,updateNow:true,URL:true,Web:true,widget:true,Window:true,XMLDOM:true,XMLHttpRequest:true,yahooCheckLogin:true,yahooLogin:true,yahooLogout:true},xmode,xquote,ax=/@cc|<\/?|script|\]*s\]|<\s*!|&lt/i,cx=/[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,tx=/^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/(\*(jslint|members?|global)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/,hx=/^\s*(['"=>\/&#]|<(?:\/|\!(?:--)?)?|[a-zA-Z][a-zA-Z0-9_\-:]*|[0-9]+|--)/,nx=/[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,nxg=/[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,ox=/[>&]|<[\/!]?|--/,lx=/\*\/|\/\*/,ix=/^([a-zA-Z_$][a-zA-Z0-9_$]*)$/,jx=/^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i,ux=/&|\+|\u00AD|\.\.|\/\*|%[^;]|base64|url|expression|data|mailto/i,sx=/^\s*([{:#%.=,>+\[\]@()"';]|\*=?|\$=|\|=|\^=|~=|[a-zA-Z_][a-zA-Z0-9_\-]*|[0-9]+|<\/|\/\*)/,ssx=/^\s*([@#!"'};:\-%.=,+\[\]()*_]|[a-zA-Z][a-zA-Z0-9._\-]*|\/\*?|\d+(?:\.\d+)?|<\/)/,qx=/[^a-zA-Z0-9+\-_\/ ]/,dx=/[\[\]\/\\"'*<>.&:(){}+=#]/,rx={outer:hx,html:hx,style:sx,styleproperty:ssx};function F(){}
if(typeof Object.create!=='function'){Object.create=function(o){F.prototype=o;return new F();};}
function is_own(object,name){return Object.prototype.hasOwnProperty.call(object,name);}
function combine(t,o){var n;for(n in o){if(is_own(o,n)){t[n]=o[n];}}}
String.prototype.entityify=function(){return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};String.prototype.isAlpha=function(){return(this>='a'&&this<='z\uffff')||(this>='A'&&this<='Z\uffff');};String.prototype.isDigit=function(){return(this>='0'&&this<='9');};String.prototype.supplant=function(o){return this.replace(/\{([^{}]*)\}/g,function(a,b){var r=o[b];return typeof r==='string'||typeof r==='number'?r:a;});};String.prototype.name=function(){if(ix.test(this)){return this;}
if(nx.test(this)){return'"'+this.replace(nxg,function(a){var c=escapes[a];if(c){return c;}
return'\\u'+('0000'+a.charCodeAt().toString(16)).slice(-4);})+'"';}
return'"'+this+'"';};function assume(){if(!option.safe){if(option.rhino){combine(predefined,rhino);}
if(option.devel){combine(predefined,devel);}
if(option.browser){combine(predefined,browser);}
if(option.windows){combine(predefined,windows);}
if(option.widget){combine(predefined,widget);}}}
function quit(m,l,ch){throw{name:'JSLintError',line:l,character:ch,message:m+" ("+Math.floor((l/lines.length)*100)+"% scanned)."};}
function warning(m,t,a,b,c,d){var ch,l,w;t=t||nexttoken;if(t.id==='(end)'){t=token;}
l=t.line||0;ch=t.from||0;w={id:'(error)',raw:m,evidence:lines[l-1]||'',line:l,character:ch,a:a,b:b,c:c,d:d};w.reason=m.supplant(w);JSLINT.errors.push(w);if(option.passfail){quit('Stopping. ',l,ch);}
warnings+=1;if(warnings>=option.maxerr){quit("Too many errors.",l,ch);}
return w;}
function warningAt(m,l,ch,a,b,c,d){return warning(m,{line:l,from:ch},a,b,c,d);}
function error(m,t,a,b,c,d){var w=warning(m,t,a,b,c,d);quit("Stopping, unable to continue.",w.line,w.character);}
function errorAt(m,l,ch,a,b,c,d){return error(m,{line:l,from:ch},a,b,c,d);}
var lex=(function lex(){var character,from,line,s;function nextLine(){var at;if(line>=lines.length){return false;}
character=1;s=lines[line];line+=1;at=s.search(/ \t/);if(at>=0){warningAt("Mixed spaces and tabs.",line,at+1);}
s=s.replace(/\t/g,tab);at=s.search(cx);if(at>=0){warningAt("Unsafe character.",line,at);}
if(option.maxlen&&option.maxlen<s.length){warningAt("Line too long.",line,s.length);}
return true;}
function it(type,value){var i,t;if(type==='(color)'){t={type:type};}else if(type==='(punctuator)'||(type==='(identifier)'&&is_own(syntax,value))){t=syntax[value]||syntax['(error)'];}else{t=syntax[type];}
t=Object.create(t);if(type==='(string)'||type==='(range)'){if(jx.test(value)){warningAt("Script URL.",line,from);}}
if(type==='(identifier)'){t.identifier=true;if(value==='__iterator__'||value==='__proto__'){errorAt("Reserved name '{a}'.",line,from,value);}else if(option.nomen&&(value.charAt(0)==='_'||value.charAt(value.length-1)==='_')){warningAt("Unexpected {a} in '{b}'.",line,from,"dangling '_'",value);}}
t.value=value;t.line=line;t.character=character;t.from=from;i=t.id;if(i!=='(endline)'){prereg=i&&(('(,=:[!&|?{};'.indexOf(i.charAt(i.length-1))>=0)||i==='return');}
return t;}
return{init:function(source){if(typeof source==='string'){lines=source.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');}else{lines=source;}
line=0;nextLine();from=1;},range:function(begin,end){var c,value='';from=character;if(s.charAt(0)!==begin){errorAt("Expected '{a}' and instead saw '{b}'.",line,character,begin,s.charAt(0));}
for(;;){s=s.slice(1);character+=1;c=s.charAt(0);switch(c){case'':errorAt("Missing '{a}'.",line,character,c);break;case end:s=s.slice(1);character+=1;return it('(range)',value);case xquote:case'\\':warningAt("Unexpected '{a}'.",line,character,c);}
value+=c;}},token:function(){var b,c,captures,d,depth,high,i,l,low,q,t;function match(x){var r=x.exec(s),r1;if(r){l=r[0].length;r1=r[1];c=r1.charAt(0);s=s.substr(l);from=character+l-r1.length;character+=l;return r1;}}
function string(x){var c,j,r='';if(jsonmode&&x!=='"'){warningAt("Strings must use doublequote.",line,character);}
if(xquote===x||(xmode==='scriptstring'&&!xquote)){return it('(punctuator)',x);}
function esc(n){var i=parseInt(s.substr(j+1,n),16);j+=n;if(i>=32&&i<=126&&i!==34&&i!==92&&i!==39){warningAt("Unnecessary escapement.",line,character);}
character+=n;c=String.fromCharCode(i);}
j=0;for(;;){while(j>=s.length){j=0;if(xmode!=='html'||!nextLine()){errorAt("Unclosed string.",line,from);}}
c=s.charAt(j);if(c===x){character+=1;s=s.substr(j+1);return it('(string)',r,x);}
if(c<' '){if(c==='\n'||c==='\r'){break;}
warningAt("Control character in string: {a}.",line,character+j,s.slice(0,j));}else if(c===xquote){warningAt("Bad HTML string",line,character+j);}else if(c==='<'){if(option.safe&&xmode==='html'){warningAt("ADsafe string violation.",line,character+j);}else if(s.charAt(j+1)==='/'&&(xmode||option.safe)){warningAt("Expected '<\\/' and instead saw '</'.",line,character);}else if(s.charAt(j+1)==='!'&&(xmode||option.safe)){warningAt("Unexpected '<!' in a string.",line,character);}}else if(c==='\\'){if(xmode==='html'){if(option.safe){warningAt("ADsafe string violation.",line,character+j);}}else if(xmode==='styleproperty'){j+=1;character+=1;c=s.charAt(j);if(c!==x){warningAt("Escapement in style string.",line,character+j);}}else{j+=1;character+=1;c=s.charAt(j);switch(c){case xquote:warningAt("Bad HTML string",line,character+j);break;case'\\':case'\'':case'"':case'/':break;case'b':c='\b';break;case'f':c='\f';break;case'n':c='\n';break;case'r':c='\r';break;case't':c='\t';break;case'u':esc(4);break;case'v':c='\v';break;case'x':if(jsonmode){warningAt("Avoid \\x-.",line,character);}
esc(2);break;default:warningAt("Bad escapement.",line,character);}}}
r+=c;character+=1;j+=1;}}
for(;;){if(!s){return it(nextLine()?'(endline)':'(end)','');}
while(xmode==='outer'){i=s.search(ox);if(i===0){break;}else if(i>0){character+=1;s=s.slice(i);break;}else{if(!nextLine()){return it('(end)','');}}}
t=match(rx[xmode]||tx);if(!t){t='';c='';while(s&&s<'!'){s=s.substr(1);}
if(s){if(xmode==='html'){return it('(error)',s.charAt(0));}else{errorAt("Unexpected '{a}'.",line,character,s.substr(0,1));}}}else{if(c.isAlpha()||c==='_'||c==='$'){return it('(identifier)',t);}
if(c.isDigit()){if(xmode!=='style'&&!isFinite(Number(t))){warningAt("Bad number '{a}'.",line,character,t);}
if(xmode!=='style'&&xmode!=='styleproperty'&&s.substr(0,1).isAlpha()){warningAt("Missing space after '{a}'.",line,character,t);}
if(c==='0'){d=t.substr(1,1);if(d.isDigit()){if(token.id!=='.'&&xmode!=='styleproperty'){warningAt("Don't use extra leading zeros '{a}'.",line,character,t);}}else if(jsonmode&&(d==='x'||d==='X')){warningAt("Avoid 0x-. '{a}'.",line,character,t);}}
if(t.substr(t.length-1)==='.'){warningAt("A trailing decimal point can be confused with a dot '{a}'.",line,character,t);}
return it('(number)',t);}
switch(t){case'"':case"'":return string(t);case'//':if(src||(xmode&&xmode!=='script')){warningAt("Unexpected comment.",line,character);}else if(xmode==='script'&&/<\s*\//i.test(s)){warningAt("Unexpected <\/ in comment.",line,character);}else if((option.safe||xmode==='script')&&ax.test(s)){warningAt("Dangerous comment.",line,character);}
s='';token.comment=true;break;case'/*':if(src||(xmode&&xmode!=='script'&&xmode!=='style'&&xmode!=='styleproperty')){warningAt("Unexpected comment.",line,character);}
if(option.safe&&ax.test(s)){warningAt("ADsafe comment violation.",line,character);}
for(;;){i=s.search(lx);if(i>=0){break;}
if(!nextLine()){errorAt("Unclosed comment.",line,character);}else{if(option.safe&&ax.test(s)){warningAt("ADsafe comment violation.",line,character);}}}
character+=i+2;if(s.substr(i,1)==='/'){errorAt("Nested comment.",line,character);}
s=s.substr(i+2);token.comment=true;break;case'/*members':case'/*member':case'/*jslint':case'/*global':case'*/':return{value:t,type:'special',line:line,character:character,from:from};case'':break;case'/':if(token.id==='/='){errorAt("A regular expression literal can be confused with '/='.",line,from);}
if(prereg){depth=0;captures=0;l=0;for(;;){b=true;c=s.charAt(l);l+=1;switch(c){case'':errorAt("Unclosed regular expression.",line,from);return;case'/':if(depth>0){warningAt("Unescaped '{a}'.",line,from+l,'/');}
c=s.substr(0,l-1);q={g:true,i:true,m:true};while(q[s.charAt(l)]===true){q[s.charAt(l)]=false;l+=1;}
character+=l;s=s.substr(l);q=s.charAt(0);if(q==='/'||q==='*'){errorAt("Confusing regular expression.",line,from);}
return it('(regexp)',c);case'\\':c=s.charAt(l);if(c<' '){warningAt("Unexpected control character in regular expression.",line,from+l);}else if(c==='<'){warningAt("Unexpected escaped character '{a}' in regular expression.",line,from+l,c);}
l+=1;break;case'(':depth+=1;b=false;if(s.charAt(l)==='?'){l+=1;switch(s.charAt(l)){case':':case'=':case'!':l+=1;break;default:warningAt("Expected '{a}' and instead saw '{b}'.",line,from+l,':',s.charAt(l));}}else{captures+=1;}
break;case'|':b=false;break;case')':if(depth===0){warningAt("Unescaped '{a}'.",line,from+l,')');}else{depth-=1;}
break;case' ':q=1;while(s.charAt(l)===' '){l+=1;q+=1;}
if(q>1){warningAt("Spaces are hard to count. Use {{a}}.",line,from+l,q);}
break;case'[':c=s.charAt(l);if(c==='^'){l+=1;if(option.regexp){warningAt("Insecure '{a}'.",line,from+l,c);}}
q=false;if(c===']'){warningAt("Empty class.",line,from+l-1);q=true;}
klass:do{c=s.charAt(l);l+=1;switch(c){case'[':case'^':warningAt("Unescaped '{a}'.",line,from+l,c);q=true;break;case'-':if(q){q=false;}else{warningAt("Unescaped '{a}'.",line,from+l,'-');q=true;}
break;case']':if(!q){warningAt("Unescaped '{a}'.",line,from+l-1,'-');}
break klass;case'\\':c=s.charAt(l);if(c<' '){warningAt("Unexpected control character in regular expression.",line,from+l);}else if(c==='<'){warningAt("Unexpected escaped character '{a}' in regular expression.",line,from+l,c);}
l+=1;q=true;break;case'/':warningAt("Unescaped '{a}'.",line,from+l-1,'/');q=true;break;case'<':if(xmode==='script'){c=s.charAt(l);if(c==='!'||c==='/'){warningAt("HTML confusion in regular expression '<{a}'.",line,from+l,c);}}
q=true;break;default:q=true;}}while(c);break;case'.':if(option.regexp){warningAt("Insecure '{a}'.",line,from+l,c);}
break;case']':case'?':case'{':case'}':case'+':case'*':warningAt("Unescaped '{a}'.",line,from+l,c);break;case'<':if(xmode==='script'){c=s.charAt(l);if(c==='!'||c==='/'){warningAt("HTML confusion in regular expression '<{a}'.",line,from+l,c);}}}
if(b){switch(s.charAt(l)){case'?':case'+':case'*':l+=1;if(s.charAt(l)==='?'){l+=1;}
break;case'{':l+=1;c=s.charAt(l);if(c<'0'||c>'9'){warningAt("Expected a number and instead saw '{a}'.",line,from+l,c);}
l+=1;low=+c;for(;;){c=s.charAt(l);if(c<'0'||c>'9'){break;}
l+=1;low=+c+(low*10);}
high=low;if(c===','){l+=1;high=Infinity;c=s.charAt(l);if(c>='0'&&c<='9'){l+=1;high=+c;for(;;){c=s.charAt(l);if(c<'0'||c>'9'){break;}
l+=1;high=+c+(high*10);}}}
if(s.charAt(l)!=='}'){warningAt("Expected '{a}' and instead saw '{b}'.",line,from+l,'}',c);}else{l+=1;}
if(s.charAt(l)==='?'){l+=1;}
if(low>high){warningAt("'{a}' should not be greater than '{b}'.",line,from+l,low,high);}}}}
c=s.substr(0,l-1);character+=l;s=s.substr(l);return it('(regexp)',c);}
return it('(punctuator)',t);case'<!--':l=line;c=character;for(;;){i=s.indexOf('--');if(i>=0){break;}
i=s.indexOf('<!');if(i>=0){errorAt("Nested HTML comment.",line,character+i);}
if(!nextLine()){errorAt("Unclosed HTML comment.",l,c);}}
l=s.indexOf('<!');if(l>=0&&l<i){errorAt("Nested HTML comment.",line,character+l);}
character+=i;if(s[i+2]!=='>'){errorAt("Expected -->.",line,character);}
character+=3;s=s.slice(i+3);break;case'#':if(xmode==='html'||xmode==='styleproperty'){for(;;){c=s.charAt(0);if((c<'0'||c>'9')&&(c<'a'||c>'f')&&(c<'A'||c>'F')){break;}
character+=1;s=s.substr(1);t+=c;}
if(t.length!==4&&t.length!==7){warningAt("Bad hex color '{a}'.",line,from+l,t);}
return it('(color)',t);}
return it('(punctuator)',t);default:if(xmode==='outer'&&c==='&'){character+=1;s=s.substr(1);for(;;){c=s.charAt(0);character+=1;s=s.substr(1);if(c===';'){break;}
if(!((c>='0'&&c<='9')||(c>='a'&&c<='z')||c==='#')){errorAt("Bad entity",line,from+l,character);}}
break;}
return it('(punctuator)',t);}}}}};}());function addlabel(t,type){if(option.safe&&funct['(global)']&&typeof predefined[t]!=='boolean'){warning('ADsafe global: '+t+'.',token);}else if(t==='hasOwnProperty'){warning("'hasOwnProperty' is a really bad name.");}
if(is_own(funct,t)&&!funct['(global)']){warning(funct[t]===true?"'{a}' was used before it was defined.":"'{a}' is already defined.",nexttoken,t);}
funct[t]=type;if(funct['(global)']){global[t]=funct;if(is_own(implied,t)){warning("'{a}' was used before it was defined.",nexttoken,t);delete implied[t];}}else{scope[t]=funct;}}
function doOption(){var b,obj,filter,o=nexttoken.value,t,v;switch(o){case'*/':error("Unbegun comment.");break;case'/*members':case'/*member':o='/*members';if(!membersOnly){membersOnly={};}
obj=membersOnly;break;case'/*jslint':if(option.safe){warning("ADsafe restriction.");}
obj=option;filter=boolOptions;break;case'/*global':if(option.safe){warning("ADsafe restriction.");}
obj=predefined;break;default:}
t=lex.token();loop:for(;;){for(;;){if(t.type==='special'&&t.value==='*/'){break loop;}
if(t.id!=='(endline)'&&t.id!==','){break;}
t=lex.token();}
if(t.type!=='(string)'&&t.type!=='(identifier)'&&o!=='/*members'){error("Bad option.",t);}
v=lex.token();if(v.id===':'){v=lex.token();if(obj===membersOnly){error("Expected '{a}' and instead saw '{b}'.",t,'*/',':');}
if(t.value==='indent'&&o==='/*jslint'){b=+v.value;if(typeof b!=='number'||!isFinite(b)||b<=0||Math.floor(b)!==b){error("Expected a small integer and instead saw '{a}'.",v,v.value);}
obj.white=true;obj.indent=b;}else if(t.value==='maxerr'&&o==='/*jslint'){b=+v.value;if(typeof b!=='number'||!isFinite(b)||b<=0||Math.floor(b)!==b){error("Expected a small integer and instead saw '{a}'.",v,v.value);}
obj.maxerr=b;}else if(t.value==='maxlen'&&o==='/*jslint'){b=+v.value;if(typeof b!=='number'||!isFinite(b)||b<=0||Math.floor(b)!==b){error("Expected a small integer and instead saw '{a}'.",v,v.value);}
obj.maxlen=b;}else if(v.value==='true'){obj[t.value]=true;}else if(v.value==='false'){obj[t.value]=false;}else{error("Bad option value.",v);}
t=lex.token();}else{if(o==='/*jslint'){error("Missing option value.",t);}
obj[t.value]=false;t=v;}}
if(filter){assume();}}
function peek(p){var i=p||0,j=0,t;while(j<=i){t=lookahead[j];if(!t){t=lookahead[j]=lex.token();}
j+=1;}
return t;}
function advance(id,t){switch(token.id){case'(number)':if(nexttoken.id==='.'){warning("A dot following a number can be confused with a decimal point.",token);}
break;case'-':if(nexttoken.id==='-'||nexttoken.id==='--'){warning("Confusing minusses.");}
break;case'+':if(nexttoken.id==='+'||nexttoken.id==='++'){warning("Confusing plusses.");}
break;}
if(token.type==='(string)'||token.identifier){anonname=token.value;}
if(id&&nexttoken.id!==id){if(t){if(nexttoken.id==='(end)'){warning("Unmatched '{a}'.",t,t.id);}else{warning("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",nexttoken,id,t.id,t.line,nexttoken.value);}}else if(nexttoken.type!=='(identifier)'||nexttoken.value!==id){warning("Expected '{a}' and instead saw '{b}'.",nexttoken,id,nexttoken.value);}}
prevtoken=token;token=nexttoken;for(;;){nexttoken=lookahead.shift()||lex.token();if(nexttoken.id==='(end)'||nexttoken.id==='(error)'){return;}
if(nexttoken.type==='special'){doOption();}else{if(nexttoken.id!=='(endline)'){break;}}}}
function parse(rbp,initial){var left;if(nexttoken.id==='(end)'){error("Unexpected early end of program.",token);}
advance();if(option.safe&&typeof predefined[token.value]==='boolean'&&(nexttoken.id!=='('&&nexttoken.id!=='.')){warning('ADsafe violation.',token);}
if(initial){anonname='anonymous';funct['(verb)']=token.value;}
if(initial===true&&token.fud){left=token.fud();}else{if(token.nud){left=token.nud();}else{if(nexttoken.type==='(number)'&&token.id==='.'){warning("A leading decimal point can be confused with a dot: '.{a}'.",token,nexttoken.value);advance();return token;}else{error("Expected an identifier and instead saw '{a}'.",token,token.id);}}
while(rbp<nexttoken.lbp){advance();if(token.led){left=token.led(left);}else{error("Expected an operator and instead saw '{a}'.",token,token.id);}}}
return left;}
function adjacent(left,right){left=left||token;right=right||nexttoken;if(option.white||xmode==='styleproperty'||xmode==='style'){if(left.character!==right.from&&left.line===right.line){warning("Unexpected space after '{a}'.",right,left.value);}}}
function nobreak(left,right){left=left||token;right=right||nexttoken;if(left.character!==right.from||left.line!==right.line){warning("Unexpected space before '{a}'.",right,right.value);}}
function nospace(left,right){left=left||token;right=right||nexttoken;if(option.white&&!left.comment){if(left.line===right.line){adjacent(left,right);}}}
function nonadjacent(left,right){if(option.white){left=left||token;right=right||nexttoken;if(left.line===right.line&&left.character===right.from){warning("Missing space after '{a}'.",nexttoken,left.value);}}}
function nobreaknonadjacent(left,right){left=left||token;right=right||nexttoken;if(!option.laxbreak&&left.line!==right.line){warning("Bad line breaking before '{a}'.",right,right.id);}else if(option.white){left=left||token;right=right||nexttoken;if(left.character===right.from){warning("Missing space after '{a}'.",nexttoken,left.value);}}}
function indentation(bias){var i;if(option.white&&nexttoken.id!=='(end)'){i=indent+(bias||0);if(nexttoken.from!==i){warning("Expected '{a}' to have an indentation at {b} instead at {c}.",nexttoken,nexttoken.value,i,nexttoken.from);}}}
function nolinebreak(t){t=t||token;if(t.line!==nexttoken.line){warning("Line breaking error '{a}'.",t,t.value);}}
function comma(){if(token.line!==nexttoken.line){if(!option.laxbreak){warning("Bad line breaking before '{a}'.",token,nexttoken.id);}}else if(token.character!==nexttoken.from&&option.white){warning("Unexpected space after '{a}'.",nexttoken,token.value);}
advance(',');nonadjacent(token,nexttoken);}
function symbol(s,p){var x=syntax[s];if(!x||typeof x!=='object'){syntax[s]=x={id:s,lbp:p,value:s};}
return x;}
function delim(s){return symbol(s,0);}
function stmt(s,f){var x=delim(s);x.identifier=x.reserved=true;x.fud=f;return x;}
function blockstmt(s,f){var x=stmt(s,f);x.block=true;return x;}
function reserveName(x){var c=x.id.charAt(0);if((c>='a'&&c<='z')||(c>='A'&&c<='Z')){x.identifier=x.reserved=true;}
return x;}
function prefix(s,f){var x=symbol(s,150);reserveName(x);x.nud=(typeof f==='function')?f:function(){this.right=parse(150);this.arity='unary';if(this.id==='++'||this.id==='--'){if(option.plusplus){warning("Unexpected use of '{a}'.",this,this.id);}else if((!this.right.identifier||this.right.reserved)&&this.right.id!=='.'&&this.right.id!=='['){warning("Bad operand.",this);}}
return this;};return x;}
function type(s,f){var x=delim(s);x.type=s;x.nud=f;return x;}
function reserve(s,f){var x=type(s,f);x.identifier=x.reserved=true;return x;}
function reservevar(s,v){return reserve(s,function(){if(this.id==='this'||this.id==='arguments'||this.id==='eval'){if(strict_mode&&funct['(global)']){warning("Strict violation.",this);}else if(option.safe){warning("ADsafe violation.",this);}}
return this;});}
function infix(s,f,p,w){var x=symbol(s,p);reserveName(x);x.led=function(left){if(!w){nobreaknonadjacent(prevtoken,token);nonadjacent(token,nexttoken);}
if(typeof f==='function'){return f(left,this);}else{this.left=left;this.right=parse(p);return this;}};return x;}
function relation(s,f){var x=symbol(s,100);x.led=function(left){nobreaknonadjacent(prevtoken,token);nonadjacent(token,nexttoken);var right=parse(100);if((left&&left.id==='NaN')||(right&&right.id==='NaN')){warning("Use the isNaN function to compare with NaN.",this);}else if(f){f.apply(this,[left,right]);}
if(left.id==='!'){warning("Confusing use of '{a}'.",left,'!');}
if(right.id==='!'){warning("Confusing use of '{a}'.",left,'!');}
this.left=left;this.right=right;return this;};return x;}
function isPoorRelation(node){return node&&((node.type==='(number)'&&+node.value===0)||(node.type==='(string)'&&node.value==='')||node.type==='true'||node.type==='false'||node.type==='undefined'||node.type==='null');}
function assignop(s,f){symbol(s,20).exps=true;return infix(s,function(left,that){var l;that.left=left;if(predefined[left.value]===false&&scope[left.value]['(global)']===true){warning("Read only.",left);}else if(left['function']){warning("'{a}' is a function.",left,left.value);}
if(option.safe){l=left;do{if(typeof predefined[l.value]==='boolean'){warning('ADsafe violation.',l);}
l=l.left;}while(l);}
if(left){if(left.id==='.'||left.id==='['){if(!left.left||left.left.value==='arguments'){warning('Bad assignment.',that);}
that.right=parse(19);return that;}else if(left.identifier&&!left.reserved){if(funct[left.value]==='exception'){warning("Do not assign to the exception parameter.",left);}
that.right=parse(19);return that;}
if(left===syntax['function']){warning("Expected an identifier in an assignment and instead saw a function invocation.",token);}}
error("Bad assignment.",that);},20);}
function bitwise(s,f,p){var x=symbol(s,p);reserveName(x);x.led=(typeof f==='function')?f:function(left){if(option.bitwise){warning("Unexpected use of '{a}'.",this,this.id);}
this.left=left;this.right=parse(p);return this;};return x;}
function bitwiseassignop(s){symbol(s,20).exps=true;return infix(s,function(left,that){if(option.bitwise){warning("Unexpected use of '{a}'.",that,that.id);}
nonadjacent(prevtoken,token);nonadjacent(token,nexttoken);if(left){if(left.id==='.'||left.id==='['||(left.identifier&&!left.reserved)){parse(19);return that;}
if(left===syntax['function']){warning("Expected an identifier in an assignment, and instead saw a function invocation.",token);}
return that;}
error("Bad assignment.",that);},20);}
function suffix(s,f){var x=symbol(s,150);x.led=function(left){if(option.plusplus){warning("Unexpected use of '{a}'.",this,this.id);}else if((!left.identifier||left.reserved)&&left.id!=='.'&&left.id!=='['){warning("Bad operand.",this);}
this.left=left;return this;};return x;}
function optionalidentifier(){if(nexttoken.identifier){advance();if(option.safe&&banned[token.value]){warning("ADsafe violation: '{a}'.",token,token.value);}else if(token.reserved&&!option.es5){warning("Expected an identifier and instead saw '{a}' (a reserved word).",token,token.id);}
return token.value;}}
function identifier(){var i=optionalidentifier();if(i){return i;}
if(token.id==='function'&&nexttoken.id==='('){warning("Missing name in function statement.");}else{error("Expected an identifier and instead saw '{a}'.",nexttoken,nexttoken.value);}}
function reachable(s){var i=0,t;if(nexttoken.id!==';'||noreach){return;}
for(;;){t=peek(i);if(t.reach){return;}
if(t.id!=='(endline)'){if(t.id==='function'){warning("Inner functions should be listed at the top of the outer function.",t);break;}
warning("Unreachable '{a}' after '{b}'.",t,t.value,s);break;}
i+=1;}}
function statement(noindent){var i=indent,r,s=scope,t=nexttoken;if(t.id===';'){warning("Unnecessary semicolon.",t);advance(';');return;}
if(t.identifier&&!t.reserved&&peek().id===':'){advance();advance(':');scope=Object.create(s);addlabel(t.value,'label');if(!nexttoken.labelled){warning("Label '{a}' on {b} statement.",nexttoken,t.value,nexttoken.value);}
if(jx.test(t.value+':')){warning("Label '{a}' looks like a javascript url.",t,t.value);}
nexttoken.label=t.value;t=nexttoken;}
if(!noindent){indentation();}
r=parse(0,true);if(!t.block){if(!r||!r.exps){warning("Expected an assignment or function call and instead saw an expression.",token);}else if(r.id==='('&&r.left.id==='new'){warning("Do not use 'new' for side effects.");}
if(nexttoken.id!==';'){warningAt("Missing semicolon.",token.line,token.from+token.value.length);}else{adjacent(token,nexttoken);advance(';');nonadjacent(token,nexttoken);}}
indent=i;scope=s;return r;}
function use_strict(){if(nexttoken.value==='use strict'){advance();advance(';');strict_mode=true;return true;}else{return false;}}
function statements(begin){var a=[],f,p;if(begin&&!use_strict()&&option.strict){warning('Missing "use strict" statement.',nexttoken);}
if(option.adsafe){switch(begin){case'script':if(!adsafe_may){if(nexttoken.value!=='ADSAFE'||peek(0).id!=='.'||(peek(1).value!=='id'&&peek(1).value!=='go')){error('ADsafe violation: Missing ADSAFE.id or ADSAFE.go.',nexttoken);}}
if(nexttoken.value==='ADSAFE'&&peek(0).id==='.'&&peek(1).value==='id'){if(adsafe_may){error('ADsafe violation.',nexttoken);}
advance('ADSAFE');advance('.');advance('id');advance('(');if(nexttoken.value!==adsafe_id){error('ADsafe violation: id does not match.',nexttoken);}
advance('(string)');advance(')');advance(';');adsafe_may=true;}
break;case'lib':if(nexttoken.value==='ADSAFE'){advance('ADSAFE');advance('.');advance('lib');advance('(');advance('(string)');comma();f=parse(0);if(f.id!=='function'){error('The second argument to lib must be a function.',f);}
p=f.funct['(params)'];p=p&&p.join(', ');if(p&&p!=='lib'){error("Expected '{a}' and instead saw '{b}'.",f,'(lib)','('+p+')');}
advance(')');advance(';');return a;}else{error("ADsafe lib violation.");}}}
while(!nexttoken.reach&&nexttoken.id!=='(end)'){if(nexttoken.id===';'){warning("Unnecessary semicolon.");advance(';');}else{a.push(statement());}}
return a;}
function block(f){var a,b=inblock,old_indent=indent,s=scope,t;inblock=f;scope=Object.create(scope);nonadjacent(token,nexttoken);t=nexttoken;if(nexttoken.id==='{'){advance('{');if(nexttoken.id!=='}'||token.line!==nexttoken.line){indent+=option.indent;while(!f&&nexttoken.from>indent){indent+=option.indent;}
if(!f){use_strict();}
a=statements();indent-=option.indent;indentation();}
advance('}',t);indent=old_indent;}else{warning("Expected '{a}' and instead saw '{b}'.",nexttoken,'{',nexttoken.value);noreach=true;a=[statement()];noreach=false;}
funct['(verb)']=null;scope=s;inblock=b;return a;}
function idValue(){return this;}
function countMember(m){if(membersOnly&&typeof membersOnly[m]!=='boolean'){warning("Unexpected /*member '{a}'.",token,m);}
if(typeof member[m]==='number'){member[m]+=1;}else{member[m]=1;}}
function note_implied(token){var name=token.value,line=token.line,a=implied[name];if(typeof a==='function'){a=false;}
if(!a){a=[line];implied[name]=a;}else if(a[a.length-1]!==line){a.push(line);}}
function cssName(){if(nexttoken.identifier){advance();return true;}}
function cssNumber(){if(nexttoken.id==='-'){advance('-');adjacent();nolinebreak();}
if(nexttoken.type==='(number)'){advance('(number)');return true;}}
function cssString(){if(nexttoken.type==='(string)'){advance();return true;}}
function cssColor(){var i,number,value;if(nexttoken.identifier){value=nexttoken.value;if(value==='rgb'||value==='rgba'){advance();advance('(');for(i=0;i<3;i+=1){if(i){advance(',');}
number=nexttoken.value;if(nexttoken.type!=='(number)'||number<0){warning("Expected a positive number and instead saw '{a}'",nexttoken,number);advance();}else{advance();if(nexttoken.id==='%'){advance('%');if(number>100){warning("Expected a percentage and instead saw '{a}'",token,number);}}else{if(number>255){warning("Expected a small number and instead saw '{a}'",token,number);}}}}
if(value==='rgba'){advance(',');number=+nexttoken.value;if(nexttoken.type!=='(number)'||number<0||number>1){warning("Expected a number between 0 and 1 and instead saw '{a}'",nexttoken,number);}
advance();if(nexttoken.id==='%'){warning("Unexpected '%'.");advance('%');}}
advance(')');return true;}else if(cssColorData[nexttoken.value]===true){advance();return true;}}else if(nexttoken.type==='(color)'){advance();return true;}
return false;}
function cssLength(){if(nexttoken.id==='-'){advance('-');adjacent();nolinebreak();}
if(nexttoken.type==='(number)'){advance();if(nexttoken.type!=='(string)'&&cssLengthData[nexttoken.value]===true){adjacent();advance();}else if(+token.value!==0){warning("Expected a linear unit and instead saw '{a}'.",nexttoken,nexttoken.value);}
return true;}
return false;}
function cssLineHeight(){if(nexttoken.id==='-'){advance('-');adjacent();}
if(nexttoken.type==='(number)'){advance();if(nexttoken.type!=='(string)'&&cssLengthData[nexttoken.value]===true){adjacent();advance();}
return true;}
return false;}
function cssWidth(){if(nexttoken.identifier){switch(nexttoken.value){case'thin':case'medium':case'thick':advance();return true;}}else{return cssLength();}}
function cssMargin(){if(nexttoken.identifier){if(nexttoken.value==='auto'){advance();return true;}}else{return cssLength();}}
function cssAttr(){if(nexttoken.identifier&&nexttoken.value==='attr'){advance();advance('(');if(!nexttoken.identifier){warning("Expected a name and instead saw '{a}'.",nexttoken,nexttoken.value);}
advance();advance(')');return true;}
return false;}
function cssCommaList(){while(nexttoken.id!==';'){if(!cssName()&&!cssString()){warning("Expected a name and instead saw '{a}'.",nexttoken,nexttoken.value);}
if(nexttoken.id!==','){return true;}
comma();}}
function cssCounter(){if(nexttoken.identifier&&nexttoken.value==='counter'){advance();advance('(');if(!nexttoken.identifier){}
advance();if(nexttoken.id===','){comma();if(nexttoken.type!=='(string)'){warning("Expected a string and instead saw '{a}'.",nexttoken,nexttoken.value);}
advance();}
advance(')');return true;}
if(nexttoken.identifier&&nexttoken.value==='counters'){advance();advance('(');if(!nexttoken.identifier){warning("Expected a name and instead saw '{a}'.",nexttoken,nexttoken.value);}
advance();if(nexttoken.id===','){comma();if(nexttoken.type!=='(string)'){warning("Expected a string and instead saw '{a}'.",nexttoken,nexttoken.value);}
advance();}
if(nexttoken.id===','){comma();if(nexttoken.type!=='(string)'){warning("Expected a string and instead saw '{a}'.",nexttoken,nexttoken.value);}
advance();}
advance(')');return true;}
return false;}
function cssShape(){var i;if(nexttoken.identifier&&nexttoken.value==='rect'){advance();advance('(');for(i=0;i<4;i+=1){if(!cssLength()){warning("Expected a number and instead saw '{a}'.",nexttoken,nexttoken.value);break;}}
advance(')');return true;}
return false;}
function cssUrl(){var c,url;if(nexttoken.identifier&&nexttoken.value==='url'){nexttoken=lex.range('(',')');url=nexttoken.value;c=url.charAt(0);if(c==='"'||c==='\''){if(url.slice(-1)!==c){warning("Bad url string.");}else{url=url.slice(1,-1);if(url.indexOf(c)>=0){warning("Bad url string.");}}}
if(!url){warning("Missing url.");}
advance();if(option.safe&&ux.test(url)){error("ADsafe URL violation.");}
urls.push(url);return true;}
return false;}
cssAny=[cssUrl,function(){for(;;){if(nexttoken.identifier){switch(nexttoken.value.toLowerCase()){case'url':cssUrl();break;case'expression':warning("Unexpected expression '{a}'.",nexttoken,nexttoken.value);advance();break;default:advance();}}else{if(nexttoken.id===';'||nexttoken.id==='!'||nexttoken.id==='(end)'||nexttoken.id==='}'){return true;}
advance();}}}];cssBorderStyle=['none','hidden','dotted','dashed','solid','double','ridge','inset','outset'];cssBreak=['auto','always','avoid','left','right'];cssOverflow=['auto','hidden','scroll','visible'];cssAttributeData={background:[true,'background-attachment','background-color','background-image','background-position','background-repeat'],'background-attachment':['scroll','fixed'],'background-color':['transparent',cssColor],'background-image':['none',cssUrl],'background-position':[2,[cssLength,'top','bottom','left','right','center']],'background-repeat':['repeat','repeat-x','repeat-y','no-repeat'],'border':[true,'border-color','border-style','border-width'],'border-bottom':[true,'border-bottom-color','border-bottom-style','border-bottom-width'],'border-bottom-color':cssColor,'border-bottom-style':cssBorderStyle,'border-bottom-width':cssWidth,'border-collapse':['collapse','separate'],'border-color':['transparent',4,cssColor],'border-left':[true,'border-left-color','border-left-style','border-left-width'],'border-left-color':cssColor,'border-left-style':cssBorderStyle,'border-left-width':cssWidth,'border-right':[true,'border-right-color','border-right-style','border-right-width'],'border-right-color':cssColor,'border-right-style':cssBorderStyle,'border-right-width':cssWidth,'border-spacing':[2,cssLength],'border-style':[4,cssBorderStyle],'border-top':[true,'border-top-color','border-top-style','border-top-width'],'border-top-color':cssColor,'border-top-style':cssBorderStyle,'border-top-width':cssWidth,'border-width':[4,cssWidth],bottom:[cssLength,'auto'],'caption-side':['bottom','left','right','top'],clear:['both','left','none','right'],clip:[cssShape,'auto'],color:cssColor,content:['open-quote','close-quote','no-open-quote','no-close-quote',cssString,cssUrl,cssCounter,cssAttr],'counter-increment':[cssName,'none'],'counter-reset':[cssName,'none'],cursor:[cssUrl,'auto','crosshair','default','e-resize','help','move','n-resize','ne-resize','nw-resize','pointer','s-resize','se-resize','sw-resize','w-resize','text','wait'],direction:['ltr','rtl'],display:['block','compact','inline','inline-block','inline-table','list-item','marker','none','run-in','table','table-caption','table-cell','table-column','table-column-group','table-footer-group','table-header-group','table-row','table-row-group'],'empty-cells':['show','hide'],'float':['left','none','right'],font:['caption','icon','menu','message-box','small-caption','status-bar',true,'font-size','font-style','font-weight','font-family'],'font-family':cssCommaList,'font-size':['xx-small','x-small','small','medium','large','x-large','xx-large','larger','smaller',cssLength],'font-size-adjust':['none',cssNumber],'font-stretch':['normal','wider','narrower','ultra-condensed','extra-condensed','condensed','semi-condensed','semi-expanded','expanded','extra-expanded'],'font-style':['normal','italic','oblique'],'font-variant':['normal','small-caps'],'font-weight':['normal','bold','bolder','lighter',cssNumber],height:[cssLength,'auto'],left:[cssLength,'auto'],'letter-spacing':['normal',cssLength],'line-height':['normal',cssLineHeight],'list-style':[true,'list-style-image','list-style-position','list-style-type'],'list-style-image':['none',cssUrl],'list-style-position':['inside','outside'],'list-style-type':['circle','disc','square','decimal','decimal-leading-zero','lower-roman','upper-roman','lower-greek','lower-alpha','lower-latin','upper-alpha','upper-latin','hebrew','katakana','hiragana-iroha','katakana-oroha','none'],margin:[4,cssMargin],'margin-bottom':cssMargin,'margin-left':cssMargin,'margin-right':cssMargin,'margin-top':cssMargin,'marker-offset':[cssLength,'auto'],'max-height':[cssLength,'none'],'max-width':[cssLength,'none'],'min-height':cssLength,'min-width':cssLength,opacity:cssNumber,outline:[true,'outline-color','outline-style','outline-width'],'outline-color':['invert',cssColor],'outline-style':['dashed','dotted','double','groove','inset','none','outset','ridge','solid'],'outline-width':cssWidth,overflow:cssOverflow,'overflow-x':cssOverflow,'overflow-y':cssOverflow,padding:[4,cssLength],'padding-bottom':cssLength,'padding-left':cssLength,'padding-right':cssLength,'padding-top':cssLength,'page-break-after':cssBreak,'page-break-before':cssBreak,position:['absolute','fixed','relative','static'],quotes:[8,cssString],right:[cssLength,'auto'],'table-layout':['auto','fixed'],'text-align':['center','justify','left','right'],'text-decoration':['none','underline','overline','line-through','blink'],'text-indent':cssLength,'text-shadow':['none',4,[cssColor,cssLength]],'text-transform':['capitalize','uppercase','lowercase','none'],top:[cssLength,'auto'],'unicode-bidi':['normal','embed','bidi-override'],'vertical-align':['baseline','bottom','sub','super','top','text-top','middle','text-bottom',cssLength],visibility:['visible','hidden','collapse'],'white-space':['normal','nowrap','pre','pre-line','pre-wrap','inherit'],width:[cssLength,'auto'],'word-spacing':['normal',cssLength],'word-wrap':['break-word','normal'],'z-index':['auto',cssNumber]};function styleAttribute(){var v;while(nexttoken.id==='*'||nexttoken.id==='#'||nexttoken.value==='_'){if(!option.css){warning("Unexpected '{a}'.",nexttoken,nexttoken.value);}
advance();}
if(nexttoken.id==='-'){if(!option.css){warning("Unexpected '{a}'.",nexttoken,nexttoken.value);}
advance('-');if(!nexttoken.identifier){warning("Expected a non-standard style attribute and instead saw '{a}'.",nexttoken,nexttoken.value);}
advance();return cssAny;}else{if(!nexttoken.identifier){warning("Excepted a style attribute, and instead saw '{a}'.",nexttoken,nexttoken.value);}else{if(is_own(cssAttributeData,nexttoken.value)){v=cssAttributeData[nexttoken.value];}else{v=cssAny;if(!option.css){warning("Unrecognized style attribute '{a}'.",nexttoken,nexttoken.value);}}}
advance();return v;}}
function styleValue(v){var i=0,n,once,match,round,start=0,vi;switch(typeof v){case'function':return v();case'string':if(nexttoken.identifier&&nexttoken.value===v){advance();return true;}
return false;}
for(;;){if(i>=v.length){return false;}
vi=v[i];i+=1;if(vi===true){break;}else if(typeof vi==='number'){n=vi;vi=v[i];i+=1;}else{n=1;}
match=false;while(n>0){if(styleValue(vi)){match=true;n-=1;}else{break;}}
if(match){return true;}}
start=i;once=[];for(;;){round=false;for(i=start;i<v.length;i+=1){if(!once[i]){if(styleValue(cssAttributeData[v[i]])){match=true;round=true;once[i]=true;break;}}}
if(!round){return match;}}}
function styleChild(){if(nexttoken.id==='(number)'){advance();if(nexttoken.value==='n'&&nexttoken.identifier){adjacent();advance();if(nexttoken.id==='+'){adjacent();advance('+');adjacent();advance('(number)');}}
return;}else{switch(nexttoken.value){case'odd':case'even':if(nexttoken.identifier){advance();return;}}}
warning("Unexpected token '{a}'.",nexttoken,nexttoken.value);}
function substyle(){var v;for(;;){if(nexttoken.id==='}'||nexttoken.id==='(end)'||xquote&&nexttoken.id===xquote){return;}
while(nexttoken.id===';'){warning("Misplaced ';'.");advance(';');}
v=styleAttribute();advance(':');if(nexttoken.identifier&&nexttoken.value==='inherit'){advance();}else{if(!styleValue(v)){warning("Unexpected token '{a}'.",nexttoken,nexttoken.value);advance();}}
if(nexttoken.id==='!'){advance('!');adjacent();if(nexttoken.identifier&&nexttoken.value==='important'){advance();}else{warning("Expected '{a}' and instead saw '{b}'.",nexttoken,'important',nexttoken.value);}}
if(nexttoken.id==='}'||nexttoken.id===xquote){warning("Missing '{a}'.",nexttoken,';');}else{advance(';');}}}
function styleSelector(){if(nexttoken.identifier){if(!is_own(htmltag,nexttoken.value)){warning("Expected a tagName, and instead saw {a}.",nexttoken,nexttoken.value);}
advance();}else{switch(nexttoken.id){case'>':case'+':advance();styleSelector();break;case':':advance(':');switch(nexttoken.value){case'active':case'after':case'before':case'checked':case'disabled':case'empty':case'enabled':case'first-child':case'first-letter':case'first-line':case'first-of-type':case'focus':case'hover':case'last-of-type':case'link':case'only-of-type':case'root':case'target':case'visited':advance();break;case'lang':advance();advance('(');if(!nexttoken.identifier){warning("Expected a lang code, and instead saw :{a}.",nexttoken,nexttoken.value);}
advance(')');break;case'nth-child':case'nth-last-child':case'nth-last-of-type':case'nth-of-type':advance();advance('(');styleChild();advance(')');break;case'not':advance();advance('(');if(nexttoken.id===':'&&peek(0).value==='not'){warning("Nested not.");}
styleSelector();advance(')');break;default:warning("Expected a pseudo, and instead saw :{a}.",nexttoken,nexttoken.value);}
break;case'#':advance('#');if(!nexttoken.identifier){warning("Expected an id, and instead saw #{a}.",nexttoken,nexttoken.value);}
advance();break;case'*':advance('*');break;case'.':advance('.');if(!nexttoken.identifier){warning("Expected a class, and instead saw #.{a}.",nexttoken,nexttoken.value);}
advance();break;case'[':advance('[');if(!nexttoken.identifier){warning("Expected an attribute, and instead saw [{a}].",nexttoken,nexttoken.value);}
advance();if(nexttoken.id==='='||nexttoken.value==='~='||nexttoken.value==='$='||nexttoken.value==='|='||nexttoken.id==='*='||nexttoken.id==='^='){advance();if(nexttoken.type!=='(string)'){warning("Expected a string, and instead saw {a}.",nexttoken,nexttoken.value);}
advance();}
advance(']');break;default:error("Expected a CSS selector, and instead saw {a}.",nexttoken,nexttoken.value);}}}
function stylePattern(){var name;if(nexttoken.id==='{'){warning("Expected a style pattern, and instead saw '{a}'.",nexttoken,nexttoken.id);}else if(nexttoken.id==='@'){advance('@');name=nexttoken.value;if(nexttoken.identifier&&atrule[name]===true){advance();return name;}
warning("Expected an at-rule, and instead saw @{a}.",nexttoken,name);}
for(;;){styleSelector();if(nexttoken.id==='</'||nexttoken.id==='{'||nexttoken.id==='(end)'){return'';}
if(nexttoken.id===','){comma();}}}
function styles(){var i;while(nexttoken.id==='@'){i=peek();if(i.identifier&&i.value==='import'){advance('@');advance();if(!cssUrl()){warning("Expected '{a}' and instead saw '{b}'.",nexttoken,'url',nexttoken.value);advance();}
advance(';');}else{break;}}
while(nexttoken.id!=='</'&&nexttoken.id!=='(end)'){stylePattern();xmode='styleproperty';if(nexttoken.id===';'){advance(';');}else{advance('{');substyle();xmode='style';advance('}');}}}
function doBegin(n){if(n!=='html'&&!option.fragment){if(n==='div'&&option.adsafe){error("ADSAFE: Use the fragment option.");}else{error("Expected '{a}' and instead saw '{b}'.",token,'html',n);}}
if(option.adsafe){if(n==='html'){error("Currently, ADsafe does not operate on whole HTML documents. It operates on <div> fragments and .js files.",token);}
if(option.fragment){if(n!=='div'){error("ADsafe violation: Wrap the widget in a div.",token);}}else{error("Use the fragment option.",token);}}
option.browser=true;assume();}
function doAttribute(n,a,v){var u,x;if(a==='id'){u=typeof v==='string'?v.toUpperCase():'';if(ids[u]===true){warning("Duplicate id='{a}'.",nexttoken,v);}
if(!/^[A-Za-z][A-Za-z0-9._:\-]*$/.test(v)){warning("Bad id: '{a}'.",nexttoken,v);}else if(option.adsafe){if(adsafe_id){if(v.slice(0,adsafe_id.length)!==adsafe_id){warning("ADsafe violation: An id must have a '{a}' prefix",nexttoken,adsafe_id);}else if(!/^[A-Z]+_[A-Z]+$/.test(v)){warning("ADSAFE violation: bad id.");}}else{adsafe_id=v;if(!/^[A-Z]+_$/.test(v)){warning("ADSAFE violation: bad id.");}}}
x=v.search(dx);if(x>=0){warning("Unexpected character '{a}' in {b}.",token,v.charAt(x),a);}
ids[u]=true;}else if(a==='class'||a==='type'||a==='name'){x=v.search(qx);if(x>=0){warning("Unexpected character '{a}' in {b}.",token,v.charAt(x),a);}
ids[u]=true;}else if(a==='href'||a==='background'||a==='content'||a==='data'||a.indexOf('src')>=0||a.indexOf('url')>=0){if(option.safe&&ux.test(v)){error("ADsafe URL violation.");}
urls.push(v);}else if(a==='for'){if(option.adsafe){if(adsafe_id){if(v.slice(0,adsafe_id.length)!==adsafe_id){warning("ADsafe violation: An id must have a '{a}' prefix",nexttoken,adsafe_id);}else if(!/^[A-Z]+_[A-Z]+$/.test(v)){warning("ADSAFE violation: bad id.");}}else{warning("ADSAFE violation: bad id.");}}}else if(a==='name'){if(option.adsafe&&v.indexOf('_')>=0){warning("ADsafe name violation.");}}}
function doTag(n,a){var i,t=htmltag[n],x;src=false;if(!t){error("Unrecognized tag '<{a}>'.",nexttoken,n===n.toLowerCase()?n:n+' (capitalization error)');}
if(stack.length>0){if(n==='html'){error("Too many <html> tags.",token);}
x=t.parent;if(x){if(x.indexOf(' '+stack[stack.length-1].name+' ')<0){error("A '<{a}>' must be within '<{b}>'.",token,n,x);}}else if(!option.adsafe&&!option.fragment){i=stack.length;do{if(i<=0){error("A '<{a}>' must be within '<{b}>'.",token,n,'body');}
i-=1;}while(stack[i].name!=='body');}}
switch(n){case'div':if(option.adsafe&&stack.length===1&&!adsafe_id){warning("ADSAFE violation: missing ID_.");}
break;case'script':xmode='script';advance('>');indent=nexttoken.from;if(a.lang){warning("lang is deprecated.",token);}
if(option.adsafe&&stack.length!==1){warning("ADsafe script placement violation.",token);}
if(a.src){if(option.adsafe&&(!adsafe_may||!approved[a.src])){warning("ADsafe unapproved script source.",token);}
if(a.type){warning("type is unnecessary.",token);}}else{if(adsafe_went){error("ADsafe script violation.",token);}
statements('script');}
xmode='html';advance('</');if(!nexttoken.identifier&&nexttoken.value!=='script'){warning("Expected '{a}' and instead saw '{b}'.",nexttoken,'script',nexttoken.value);}
advance();xmode='outer';break;case'style':xmode='style';advance('>');styles();xmode='html';advance('</');if(!nexttoken.identifier&&nexttoken.value!=='style'){warning("Expected '{a}' and instead saw '{b}'.",nexttoken,'style',nexttoken.value);}
advance();xmode='outer';break;case'input':switch(a.type){case'radio':case'checkbox':case'button':case'reset':case'submit':break;case'text':case'file':case'password':case'file':case'hidden':case'image':if(option.adsafe&&a.autocomplete!=='off'){warning("ADsafe autocomplete violation.");}
break;default:warning("Bad input type.");}
break;case'applet':case'body':case'embed':case'frame':case'frameset':case'head':case'iframe':case'noembed':case'noframes':case'object':case'param':if(option.adsafe){warning("ADsafe violation: Disallowed tag: "+n);}
break;}}
function closetag(n){return'</'+n+'>';}
function html(){var a,attributes,e,n,q,t,v,w=option.white,wmode;xmode='html';xquote='';stack=null;for(;;){switch(nexttoken.value){case'<':xmode='html';advance('<');attributes={};t=nexttoken;if(!t.identifier){warning("Bad identifier {a}.",t,t.value);}
n=t.value;if(option.cap){n=n.toLowerCase();}
t.name=n;advance();if(!stack){stack=[];doBegin(n);}
v=htmltag[n];if(typeof v!=='object'){error("Unrecognized tag '<{a}>'.",t,n);}
e=v.empty;t.type=n;for(;;){if(nexttoken.id==='/'){advance('/');if(nexttoken.id!=='>'){warning("Expected '{a}' and instead saw '{b}'.",nexttoken,'>',nexttoken.value);}
break;}
if(nexttoken.id&&nexttoken.id.substr(0,1)==='>'){break;}
if(!nexttoken.identifier){if(nexttoken.id==='(end)'||nexttoken.id==='(error)'){error("Missing '>'.",nexttoken);}
warning("Bad identifier.");}
option.white=true;nonadjacent(token,nexttoken);a=nexttoken.value;option.white=w;advance();if(!option.cap&&a!==a.toLowerCase()){warning("Attribute '{a}' not all lower case.",nexttoken,a);}
a=a.toLowerCase();xquote='';if(is_own(attributes,a)){warning("Attribute '{a}' repeated.",nexttoken,a);}
if(a.slice(0,2)==='on'){if(!option.on){warning("Avoid HTML event handlers.");}
xmode='scriptstring';advance('=');q=nexttoken.id;if(q!=='"'&&q!=="'"){error("Missing quote.");}
xquote=q;wmode=option.white;option.white=false;advance(q);statements('on');option.white=wmode;if(nexttoken.id!==q){error("Missing close quote on script attribute.");}
xmode='html';xquote='';advance(q);v=false;}else if(a==='style'){xmode='scriptstring';advance('=');q=nexttoken.id;if(q!=='"'&&q!=="'"){error("Missing quote.");}
xmode='styleproperty';xquote=q;advance(q);substyle();xmode='html';xquote='';advance(q);v=false;}else{if(nexttoken.id==='='){advance('=');v=nexttoken.value;if(!nexttoken.identifier&&nexttoken.id!=='"'&&nexttoken.id!=='\''&&nexttoken.type!=='(string)'&&nexttoken.type!=='(number)'&&nexttoken.type!=='(color)'){warning("Expected an attribute value and instead saw '{a}'.",token,a);}
advance();}else{v=true;}}
attributes[a]=v;doAttribute(n,a,v);}
doTag(n,attributes);if(!e){stack.push(t);}
xmode='outer';advance('>');break;case'</':xmode='html';advance('</');if(!nexttoken.identifier){warning("Bad identifier.");}
n=nexttoken.value;if(option.cap){n=n.toLowerCase();}
advance();if(!stack){error("Unexpected '{a}'.",nexttoken,closetag(n));}
t=stack.pop();if(!t){error("Unexpected '{a}'.",nexttoken,closetag(n));}
if(t.name!==n){error("Expected '{a}' and instead saw '{b}'.",nexttoken,closetag(t.name),closetag(n));}
if(nexttoken.id!=='>'){error("Missing '{a}'.",nexttoken,'>');}
xmode='outer';advance('>');break;case'<!':if(option.safe){warning("ADsafe HTML violation.");}
xmode='html';for(;;){advance();if(nexttoken.id==='>'||nexttoken.id==='(end)'){break;}
if(nexttoken.value.indexOf('--')>=0){error("Unexpected --.");}
if(nexttoken.value.indexOf('<')>=0){error("Unexpected <.");}
if(nexttoken.value.indexOf('>')>=0){error("Unexpected >.");}}
xmode='outer';advance('>');break;case'(end)':return;default:if(nexttoken.id==='(end)'){error("Missing '{a}'.",nexttoken,'</'+stack[stack.length-1].value+'>');}else{advance();}}
if(stack&&stack.length===0&&(option.adsafe||!option.fragment||nexttoken.id==='(end)')){break;}}
if(nexttoken.id!=='(end)'){error("Unexpected material after the end.");}}
type('(number)',idValue);type('(string)',idValue);syntax['(identifier)']={type:'(identifier)',lbp:0,identifier:true,nud:function(){var v=this.value,s=scope[v],f;if(typeof s==='function'){s=undefined;}else if(typeof s==='boolean'){f=funct;funct=functions[0];addlabel(v,'var');s=funct;funct=f;}
if(funct===s){switch(funct[v]){case'unused':funct[v]='var';break;case'unction':funct[v]='function';this['function']=true;break;case'function':this['function']=true;break;case'label':warning("'{a}' is a statement label.",token,v);break;}}else if(funct['(global)']){if(option.undef&&predefined[v]!=='boolean'){warning("'{a}' is not defined.",token,v);}
note_implied(token);}else{switch(funct[v]){case'closure':case'function':case'var':case'unused':warning("'{a}' used out of scope.",token,v);break;case'label':warning("'{a}' is a statement label.",token,v);break;case'outer':case'global':break;default:if(s===true){funct[v]=true;}else if(s===null){warning("'{a}' is not allowed.",token,v);note_implied(token);}else if(typeof s!=='object'){if(option.undef){warning("'{a}' is not defined.",token,v);}else{funct[v]=true;}
note_implied(token);}else{switch(s[v]){case'function':case'unction':this['function']=true;s[v]='closure';funct[v]=s['(global)']?'global':'outer';break;case'var':case'unused':s[v]='closure';funct[v]=s['(global)']?'global':'outer';break;case'closure':case'parameter':funct[v]=s['(global)']?'global':'outer';break;case'label':warning("'{a}' is a statement label.",token,v);}}}}
return this;},led:function(){error("Expected an operator and instead saw '{a}'.",nexttoken,nexttoken.value);}};type('(regexp)',function(){return this;});delim('(endline)');delim('(begin)');delim('(end)').reach=true;delim('</').reach=true;delim('<!');delim('<!--');delim('-->');delim('(error)').reach=true;delim('}').reach=true;delim(')');delim(']');delim('"').reach=true;delim("'").reach=true;delim(';');delim(':').reach=true;delim(',');delim('#');delim('@');reserve('else');reserve('case').reach=true;reserve('catch');reserve('default').reach=true;reserve('finally');reservevar('arguments');reservevar('eval');reservevar('false');reservevar('Infinity');reservevar('NaN');reservevar('null');reservevar('this');reservevar('true');reservevar('undefined');assignop('=','assign',20);assignop('+=','assignadd',20);assignop('-=','assignsub',20);assignop('*=','assignmult',20);assignop('/=','assigndiv',20).nud=function(){error("A regular expression literal can be confused with '/='.");};assignop('%=','assignmod',20);bitwiseassignop('&=','assignbitand',20);bitwiseassignop('|=','assignbitor',20);bitwiseassignop('^=','assignbitxor',20);bitwiseassignop('<<=','assignshiftleft',20);bitwiseassignop('>>=','assignshiftright',20);bitwiseassignop('>>>=','assignshiftrightunsigned',20);infix('?',function(left,that){that.left=left;that.right=parse(10);advance(':');that['else']=parse(10);return that;},30);infix('||','or',40);infix('&&','and',50);bitwise('|','bitor',70);bitwise('^','bitxor',80);bitwise('&','bitand',90);relation('==',function(left,right){if(option.eqeqeq){warning("Expected '{a}' and instead saw '{b}'.",this,'===','==');}else if(isPoorRelation(left)){warning("Use '{a}' to compare with '{b}'.",this,'===',left.value);}else if(isPoorRelation(right)){warning("Use '{a}' to compare with '{b}'.",this,'===',right.value);}
return this;});relation('===');relation('!=',function(left,right){if(option.eqeqeq){warning("Expected '{a}' and instead saw '{b}'.",this,'!==','!=');}else if(isPoorRelation(left)){warning("Use '{a}' to compare with '{b}'.",this,'!==',left.value);}else if(isPoorRelation(right)){warning("Use '{a}' to compare with '{b}'.",this,'!==',right.value);}
return this;});relation('!==');relation('<');relation('>');relation('<=');relation('>=');bitwise('<<','shiftleft',120);bitwise('>>','shiftright',120);bitwise('>>>','shiftrightunsigned',120);infix('in','in',120);infix('instanceof','instanceof',120);infix('+',function(left,that){var right=parse(130);if(left&&right&&left.id==='(string)'&&right.id==='(string)'){left.value+=right.value;left.character=right.character;if(jx.test(left.value)){warning("JavaScript URL.",left);}
return left;}
that.left=left;that.right=right;return that;},130);prefix('+','num');prefix('+++',function(){warning("Confusing pluses.");this.right=parse(150);this.arity='unary';return this;});infix('+++',function(left){warning("Confusing pluses.");this.left=left;this.right=parse(130);return this;},130);infix('-','sub',130);prefix('-','neg');prefix('---',function(){warning("Confusing minuses.");this.right=parse(150);this.arity='unary';return this;});infix('---',function(left){warning("Confusing minuses.");this.left=left;this.right=parse(130);return this;},130);infix('*','mult',140);infix('/','div',140);infix('%','mod',140);suffix('++','postinc');prefix('++','preinc');syntax['++'].exps=true;suffix('--','postdec');prefix('--','predec');syntax['--'].exps=true;prefix('delete',function(){var p=parse(0);if(!p||(p.id!=='.'&&p.id!=='[')){warning("Variables should not be deleted.");}
this.first=p;return this;}).exps=true;prefix('~',function(){if(option.bitwise){warning("Unexpected '{a}'.",this,'~');}
parse(150);return this;});prefix('!',function(){this.right=parse(150);this.arity='unary';if(bang[this.right.id]===true){warning("Confusing use of '{a}'.",this,'!');}
return this;});prefix('typeof','typeof');prefix('new',function(){var c=parse(155),i;if(c&&c.id!=='function'){if(c.identifier){c['new']=true;switch(c.value){case'Object':warning("Use the object literal notation {}.",token);break;case'Array':if(nexttoken.id!=='('){warning("Use the array literal notation [].",token);}else{advance('(');if(nexttoken.id===')'){warning("Use the array literal notation [].",token);}else{i=parse(0);c.dimension=i;if((i.id==='(number)'&&/[.+\-Ee]/.test(i.value))||(i.id==='-'&&!i.right)||i.id==='(string)'||i.id==='['||i.id==='{'||i.id==='true'||i.id==='false'||i.id==='null'||i.id==='undefined'||i.id==='Infinity'){warning("Use the array literal notation [].",token);}
if(nexttoken.id!==')'){error("Use the array literal notation [].",token);}}
advance(')');}
this.first=c;return this;case'Number':case'String':case'Boolean':case'Math':case'JSON':warning("Do not use {a} as a constructor.",token,c.value);break;case'Function':if(!option.evil){warning("The Function constructor is eval.");}
break;case'Date':case'RegExp':break;default:if(c.id!=='function'){i=c.value.substr(0,1);if(option.newcap&&(i<'A'||i>'Z')){warning("A constructor name should start with an uppercase letter.",token);}}}}else{if(c.id!=='.'&&c.id!=='['&&c.id!=='('){warning("Bad constructor.",token);}}}else{warning("Weird construction. Delete 'new'.",this);}
adjacent(token,nexttoken);if(nexttoken.id!=='('){warning("Missing '()' invoking a constructor.");}
this.first=c;return this;});syntax['new'].exps=true;infix('.',function(left,that){adjacent(prevtoken,token);nobreak();var m=identifier();if(typeof m==='string'){countMember(m);}
that.left=left;that.right=m;if(left&&left.value==='arguments'&&(m==='callee'||m==='caller')){warning("Avoid arguments.{a}.",left,m);}else if(!option.evil&&left&&left.value==='document'&&(m==='write'||m==='writeln')){warning("document.write can be a form of eval.",left);}else if(option.adsafe){if(left&&left.value==='ADSAFE'){if(m==='id'||m==='lib'){warning("ADsafe violation.",that);}else if(m==='go'){if(xmode!=='script'){warning("ADsafe violation.",that);}else if(adsafe_went||nexttoken.id!=='('||peek(0).id!=='(string)'||peek(0).value!==adsafe_id||peek(1).id!==','){error("ADsafe violation: go.",that);}
adsafe_went=true;adsafe_may=false;}}}
if(!option.evil&&(m==='eval'||m==='execScript')){warning('eval is evil.');}else if(option.safe){for(;;){if(banned[m]===true){warning("ADsafe restricted word '{a}'.",token,m);}
if(typeof predefined[left.value]!=='boolean'||nexttoken.id==='('){break;}
if(standard_member[m]===true){if(nexttoken.id==='.'){warning("ADsafe violation.",that);}
break;}
if(nexttoken.id!=='.'){warning("ADsafe violation.",that);break;}
advance('.');token.left=that;token.right=m;that=token;m=identifier();if(typeof m==='string'){countMember(m);}}}
return that;},160,true);infix('(',function(left,that){adjacent(prevtoken,token);nospace();if(option.immed&&!left.immed&&left.id==='function'){warning("Wrap an immediate function invocation in parentheses "+"to assist the reader in understanding that the expression "+"is the result of a function, and not the function itself.");}
var n=0,p=[];if(left){if(left.type==='(identifier)'){if(left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)){if(left.value!=='Number'&&left.value!=='String'&&left.value!=='Boolean'&&left.value!=='Date'){if(left.value==='Math'){warning("Math is not a function.",left);}else if(option.newcap){warning("Missing 'new' prefix when invoking a constructor.",left);}}}}else if(left.id==='.'){if(option.safe&&left.left.value==='Math'&&left.right==='random'){warning("ADsafe violation.",left);}}}
if(nexttoken.id!==')'){for(;;){p[p.length]=parse(10);n+=1;if(nexttoken.id!==','){break;}
comma();}}
advance(')');nospace(prevtoken,token);if(typeof left==='object'){if(left.value==='parseInt'&&n===1){warning("Missing radix parameter.",left);}
if(!option.evil){if(left.value==='eval'||left.value==='Function'||left.value==='execScript'){warning("eval is evil.",left);}else if(p[0]&&p[0].id==='(string)'&&(left.value==='setTimeout'||left.value==='setInterval')){warning("Implied eval is evil. Pass a function instead of a string.",left);}}
if(!left.identifier&&left.id!=='.'&&left.id!=='['&&left.id!=='('&&left.id!=='&&'&&left.id!=='||'&&left.id!=='?'){warning("Bad invocation.",left);}}
that.left=left;return that;},155,true).exps=true;prefix('(',function(){nospace();if(nexttoken.id==='function'){nexttoken.immed=true;}
var v=parse(0);advance(')',this);nospace(prevtoken,token);if(option.immed&&v.id==='function'){if(nexttoken.id==='('){warning("Move the invocation into the parens that contain the function.",nexttoken);}else{warning("Do not wrap function literals in parens unless they are to be immediately invoked.",this);}}
return v;});infix('[',function(left,that){nospace();var e=parse(0),s;if(e&&e.type==='(string)'){if(option.safe&&banned[e.value]===true){warning("ADsafe restricted word '{a}'.",that,e.value);}else if(!option.evil&&(e.value==='eval'||e.value==='execScript')){warning("eval is evil.",that);}else if(option.safe&&(e.value.charAt(0)==='_'||e.value.charAt(0)==='-')){warning("ADsafe restricted subscript '{a}'.",that,e.value);}
countMember(e.value);if(!option.sub&&ix.test(e.value)){s=syntax[e.value];if(!s||!s.reserved){warning("['{a}'] is better written in dot notation.",e,e.value);}}}else if(!e||e.type!=='(number)'||e.value<0){if(option.safe){warning('ADsafe subscripting.');}}
advance(']',that);nospace(prevtoken,token);that.left=left;that.right=e;return that;},160,true);prefix('[',function(){var b=token.line!==nexttoken.line;this.first=[];if(b){indent+=option.indent;if(nexttoken.from===indent+option.indent){indent+=option.indent;}}
while(nexttoken.id!=='(end)'){while(nexttoken.id===','){warning("Extra comma.");advance(',');}
if(nexttoken.id===']'){break;}
if(b&&token.line!==nexttoken.line){indentation();}
this.first.push(parse(10));if(nexttoken.id===','){comma();if(nexttoken.id===']'&&!option.es5){warning("Extra comma.",token);break;}}else{break;}}
if(b){indent-=option.indent;indentation();}
advance(']',this);return this;},160);function property_name(){var id=optionalidentifier(true);if(!id){if(nexttoken.id==='(string)'){id=nexttoken.value;if(option.adsafe&&(id.charAt(0)==='_'||id.charAt(id.length-1)==='_')){warning("Unexpected {a} in '{b}'.",token,"dangling '_'",id);}
advance();}else if(nexttoken.id==='(number)'){id=nexttoken.value.toString();advance();}}
return id;}
function functionparams(){var i,t=nexttoken,p=[];advance('(');nospace();if(nexttoken.id===')'){advance(')');nospace(prevtoken,token);return;}
for(;;){i=identifier();p.push(i);addlabel(i,'parameter');if(nexttoken.id===','){comma();}else{advance(')',t);nospace(prevtoken,token);return p;}}}
function doFunction(i){var f,s=scope;scope=Object.create(s);funct={'(name)':i||'"'+anonname+'"','(line)':nexttoken.line,'(context)':funct,'(breakage)':0,'(loopage)':0,'(scope)':scope};f=funct;token.funct=funct;functions.push(funct);if(i){addlabel(i,'function');}
funct['(params)']=functionparams();block(false);scope=s;funct['(last)']=token.line;funct=funct['(context)'];return f;}
(function(x){x.nud=function(){var b,f,i,j,p,seen={},t;b=token.line!==nexttoken.line;if(b){indent+=option.indent;if(nexttoken.from===indent+option.indent){indent+=option.indent;}}
for(;;){if(nexttoken.id==='}'){break;}
if(b){indentation();}
if(nexttoken.value==='get'&&peek().id!==':'){advance('get');if(!option.es5){error("get/set are ES5 features.");}
i=property_name();if(!i){error("Missing property name.");}
t=nexttoken;adjacent(token,nexttoken);f=doFunction(i);if(funct['(loopage)']){warning("Don't make functions within a loop.",t);}
p=f['(params)'];if(p){warning("Unexpected parameter '{a}' in get {b} function.",t,p[0],i);}
adjacent(token,nexttoken);advance(',');indentation();advance('set');j=property_name();if(i!==j){error("Expected {a} and instead saw {b}.",token,i,j);}
t=nexttoken;adjacent(token,nexttoken);f=doFunction(i);p=f['(params)'];if(!p||p.length!==1||p[0]!=='value'){warning("Expected (value) in set {a} function.",t,i);}}else{i=property_name();if(typeof i!=='string'){break;}
advance(':');nonadjacent(token,nexttoken);parse(10);}
if(seen[i]===true){warning("Duplicate member '{a}'.",nexttoken,i);}
seen[i]=true;countMember(i);if(nexttoken.id===','){comma();if(nexttoken.id===','){warning("Extra comma.",token);}else if(nexttoken.id==='}'&&!option.es5){warning("Extra comma.",token);}}else{break;}}
if(b){indent-=option.indent;indentation();}
advance('}',this);return this;};x.fud=function(){error("Expected to see a statement and instead saw a block.",token);};}(delim('{')));function varstatement(prefix){var id,name,value;if(funct['(onevar)']&&option.onevar){warning("Too many var statements.");}else if(!funct['(global)']){funct['(onevar)']=true;}
this.first=[];for(;;){nonadjacent(token,nexttoken);id=identifier();if(funct['(global)']&&predefined[id]===false){warning("Redefinition of '{a}'.",token,id);}
addlabel(id,'unused');if(prefix){break;}
name=token;this.first.push(token);if(nexttoken.id==='='){nonadjacent(token,nexttoken);advance('=');nonadjacent(token,nexttoken);if(nexttoken.id==='undefined'){warning("It is not necessary to initialize '{a}' to 'undefined'.",token,id);}
if(peek(0).id==='='&&nexttoken.identifier){error("Variable {a} was not declared correctly.",nexttoken,nexttoken.value);}
value=parse(0);name.first=value;}
if(nexttoken.id!==','){break;}
comma();}
return this;}
stmt('var',varstatement).exps=true;blockstmt('function',function(){if(inblock){warning("Function statements cannot be placed in blocks. Use a function expression or move the statement to the top of the outer function.",token);}
var i=identifier();adjacent(token,nexttoken);addlabel(i,'unction');doFunction(i);if(nexttoken.id==='('&&nexttoken.line===token.line){error("Function statements are not invocable. Wrap the whole function invocation in parens.");}
return this;});prefix('function',function(){var i=optionalidentifier();if(i){adjacent(token,nexttoken);}else{nonadjacent(token,nexttoken);}
doFunction(i);if(funct['(loopage)']){warning("Don't make functions within a loop.");}
return this;});blockstmt('if',function(){var t=nexttoken;advance('(');nonadjacent(this,t);nospace();parse(20);if(nexttoken.id==='='){warning("Expected a conditional expression and instead saw an assignment.");advance('=');parse(20);}
advance(')',t);nospace(prevtoken,token);block(true);if(nexttoken.id==='else'){nonadjacent(token,nexttoken);advance('else');if(nexttoken.id==='if'||nexttoken.id==='switch'){statement(true);}else{block(true);}}
return this;});blockstmt('try',function(){var b,e,s;if(option.adsafe){warning("ADsafe try violation.",this);}
block(false);if(nexttoken.id==='catch'){advance('catch');nonadjacent(token,nexttoken);advance('(');s=scope;scope=Object.create(s);e=nexttoken.value;if(nexttoken.type!=='(identifier)'){warning("Expected an identifier and instead saw '{a}'.",nexttoken,e);}else{addlabel(e,'exception');}
advance();advance(')');block(false);b=true;scope=s;}
if(nexttoken.id==='finally'){advance('finally');block(false);return;}else if(!b){error("Expected '{a}' and instead saw '{b}'.",nexttoken,'catch',nexttoken.value);}
return this;});blockstmt('while',function(){var t=nexttoken;funct['(breakage)']+=1;funct['(loopage)']+=1;advance('(');nonadjacent(this,t);nospace();parse(20);if(nexttoken.id==='='){warning("Expected a conditional expression and instead saw an assignment.");advance('=');parse(20);}
advance(')',t);nospace(prevtoken,token);block(true);funct['(breakage)']-=1;funct['(loopage)']-=1;return this;}).labelled=true;reserve('with');blockstmt('switch',function(){var t=nexttoken,g=false;funct['(breakage)']+=1;advance('(');nonadjacent(this,t);nospace();this.condition=parse(20);advance(')',t);nospace(prevtoken,token);nonadjacent(token,nexttoken);t=nexttoken;advance('{');nonadjacent(token,nexttoken);indent+=option.indent;this.cases=[];for(;;){switch(nexttoken.id){case'case':switch(funct['(verb)']){case'break':case'case':case'continue':case'return':case'switch':case'throw':break;default:warning("Expected a 'break' statement before 'case'.",token);}
indentation(-option.indent);advance('case');this.cases.push(parse(20));g=true;advance(':');funct['(verb)']='case';break;case'default':switch(funct['(verb)']){case'break':case'continue':case'return':case'throw':break;default:warning("Expected a 'break' statement before 'default'.",token);}
indentation(-option.indent);advance('default');g=true;advance(':');break;case'}':indent-=option.indent;indentation();advance('}',t);if(this.cases.length===1||this.condition.id==='true'||this.condition.id==='false'){warning("This 'switch' should be an 'if'.",this);}
funct['(breakage)']-=1;funct['(verb)']=undefined;return;case'(end)':error("Missing '{a}'.",nexttoken,'}');return;default:if(g){switch(token.id){case',':error("Each value should have its own case label.");return;case':':statements();break;default:error("Missing ':' on a case clause.",token);}}else{error("Expected '{a}' and instead saw '{b}'.",nexttoken,'case',nexttoken.value);}}}}).labelled=true;stmt('debugger',function(){if(!option.debug){warning("All 'debugger' statements should be removed.");}
return this;}).exps=true;(function(){var x=stmt('do',function(){funct['(breakage)']+=1;funct['(loopage)']+=1;this.first=block(true);advance('while');var t=nexttoken;nonadjacent(token,t);advance('(');nospace();parse(20);if(nexttoken.id==='='){warning("Expected a conditional expression and instead saw an assignment.");advance('=');parse(20);}
advance(')',t);nospace(prevtoken,token);funct['(breakage)']-=1;funct['(loopage)']-=1;return this;});x.labelled=true;x.exps=true;}());blockstmt('for',function(){var f=option.forin,s,t=nexttoken;funct['(breakage)']+=1;funct['(loopage)']+=1;advance('(');nonadjacent(this,t);nospace();if(peek(nexttoken.id==='var'?1:0).id==='in'){if(nexttoken.id==='var'){advance('var');varstatement(true);}else{switch(funct[nexttoken.value]){case'unused':funct[nexttoken.value]='var';break;case'var':break;default:warning("Bad for in variable '{a}'.",nexttoken,nexttoken.value);}
advance();}
advance('in');parse(20);advance(')',t);s=block(true);if(!f&&(s.length>1||typeof s[0]!=='object'||s[0].value!=='if')){warning("The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.",this);}
funct['(breakage)']-=1;funct['(loopage)']-=1;return this;}else{if(nexttoken.id!==';'){if(nexttoken.id==='var'){advance('var');varstatement();}else{for(;;){parse(0,'for');if(nexttoken.id!==','){break;}
comma();}}}
nolinebreak(token);advance(';');if(nexttoken.id!==';'){parse(20);if(nexttoken.id==='='){warning("Expected a conditional expression and instead saw an assignment.");advance('=');parse(20);}}
nolinebreak(token);advance(';');if(nexttoken.id===';'){error("Expected '{a}' and instead saw '{b}'.",nexttoken,')',';');}
if(nexttoken.id!==')'){for(;;){parse(0,'for');if(nexttoken.id!==','){break;}
comma();}}
advance(')',t);nospace(prevtoken,token);block(true);funct['(breakage)']-=1;funct['(loopage)']-=1;return this;}}).labelled=true;stmt('break',function(){var v=nexttoken.value;if(funct['(breakage)']===0){warning("Unexpected '{a}'.",nexttoken,this.value);}
nolinebreak(this);if(nexttoken.id!==';'){if(token.line===nexttoken.line){if(funct[v]!=='label'){warning("'{a}' is not a statement label.",nexttoken,v);}else if(scope[v]!==funct){warning("'{a}' is out of scope.",nexttoken,v);}
this.first=nexttoken;advance();}}
reachable('break');return this;}).exps=true;stmt('continue',function(){var v=nexttoken.value;if(funct['(breakage)']===0){warning("Unexpected '{a}'.",nexttoken,this.value);}
nolinebreak(this);if(nexttoken.id!==';'){if(token.line===nexttoken.line){if(funct[v]!=='label'){warning("'{a}' is not a statement label.",nexttoken,v);}else if(scope[v]!==funct){warning("'{a}' is out of scope.",nexttoken,v);}
this.first=nexttoken;advance();}}else if(!funct['(loopage)']){warning("Unexpected '{a}'.",nexttoken,this.value);}
reachable('continue');return this;}).exps=true;stmt('return',function(){nolinebreak(this);if(nexttoken.id==='(regexp)'){warning("Wrap the /regexp/ literal in parens to disambiguate the slash operator.");}
if(nexttoken.id!==';'&&!nexttoken.reach){nonadjacent(token,nexttoken);this.first=parse(20);}
reachable('return');return this;}).exps=true;stmt('throw',function(){nolinebreak(this);nonadjacent(token,nexttoken);this.first=parse(20);reachable('throw');return this;}).exps=true;reserve('void');reserve('class');reserve('const');reserve('enum');reserve('export');reserve('extends');reserve('import');reserve('super');reserve('let');reserve('yield');reserve('implements');reserve('interface');reserve('package');reserve('private');reserve('protected');reserve('public');reserve('static');function jsonValue(){function jsonObject(){var o={},t=nexttoken;advance('{');if(nexttoken.id!=='}'){for(;;){if(nexttoken.id==='(end)'){error("Missing '}' to match '{' from line {a}.",nexttoken,t.line);}else if(nexttoken.id==='}'){warning("Unexpected comma.",token);break;}else if(nexttoken.id===','){error("Unexpected comma.",nexttoken);}else if(nexttoken.id!=='(string)'){warning("Expected a string and instead saw {a}.",nexttoken,nexttoken.value);}
if(o[nexttoken.value]===true){warning("Duplicate key '{a}'.",nexttoken,nexttoken.value);}else if(nexttoken.value==='__proto__'){warning("Stupid key '{a}'.",nexttoken,nexttoken.value);}else{o[nexttoken.value]=true;}
advance();advance(':');jsonValue();if(nexttoken.id!==','){break;}
advance(',');}}
advance('}');}
function jsonArray(){var t=nexttoken;advance('[');if(nexttoken.id!==']'){for(;;){if(nexttoken.id==='(end)'){error("Missing ']' to match '[' from line {a}.",nexttoken,t.line);}else if(nexttoken.id===']'){warning("Unexpected comma.",token);break;}else if(nexttoken.id===','){error("Unexpected comma.",nexttoken);}
jsonValue();if(nexttoken.id!==','){break;}
advance(',');}}
advance(']');}
switch(nexttoken.id){case'{':jsonObject();break;case'[':jsonArray();break;case'true':case'false':case'null':case'(number)':case'(string)':advance();break;case'-':advance('-');if(token.character!==nexttoken.from){warning("Unexpected space after '-'.",token);}
adjacent(token,nexttoken);advance('(number)');break;default:error("Expected a JSON value.",nexttoken);}}
var itself=function(s,o){var a,i;JSLINT.errors=[];predefined=Object.create(standard);if(o){a=o.predef;if(a instanceof Array){for(i=0;i<a.length;i+=1){predefined[a[i]]=true;}}
if(o.adsafe){o.safe=true;}
if(o.safe){o.browser=o.css=o.debug=o.devel=o.evil=o.forin=o.on=o.rhino=o.windows=o.sub=o.widget=false;o.eqeqeq=o.nomen=o.safe=o.strict=o.undef=true;predefined.Date=predefined['eval']=predefined.Function=predefined.Object=null;predefined.ADSAFE=predefined.lib=false;}
option=o;}else{option={};}
option.indent=option.indent||4;option.maxerr=option.maxerr||50;adsafe_id='';adsafe_may=false;adsafe_went=false;approved={};if(option.approved){for(i=0;i<option.approved.length;i+=1){approved[option.approved[i]]=option.approved[i];}}else{approved.test='test';}
tab='';for(i=0;i<option.indent;i+=1){tab+=' ';}
indent=1;global=Object.create(predefined);scope=global;funct={'(global)':true,'(name)':'(global)','(scope)':scope,'(breakage)':0,'(loopage)':0};functions=[funct];ids={};urls=[];src=false;xmode=false;stack=null;member={};membersOnly=null;implied={};inblock=false;lookahead=[];jsonmode=false;warnings=0;lex.init(s);prereg=true;strict_mode=false;prevtoken=token=nexttoken=syntax['(begin)'];assume();try{advance();if(nexttoken.value.charAt(0)==='<'){html();if(option.adsafe&&!adsafe_went){warning("ADsafe violation: Missing ADSAFE.go.",this);}}else{switch(nexttoken.id){case'{':case'[':option.laxbreak=true;jsonmode=true;jsonValue();break;case'@':case'*':case'#':case'.':case':':xmode='style';advance();if(token.id!=='@'||!nexttoken.identifier||nexttoken.value!=='charset'||token.line!==1||token.from!==1){error('A css file should begin with @charset "UTF-8";');}
advance();if(nexttoken.type!=='(string)'&&nexttoken.value!=='UTF-8'){error('A css file should begin with @charset "UTF-8";');}
advance();advance(';');styles();break;default:if(option.adsafe&&option.fragment){error("Expected '{a}' and instead saw '{b}'.",nexttoken,'<div>',nexttoken.value);}
statements('lib');}}
advance('(end)');}catch(e){if(e){JSLINT.errors.push({reason:e.message,line:e.line||nexttoken.line,character:e.character||nexttoken.from},null);}}
return JSLINT.errors.length===0;};function is_array(o){return Object.prototype.toString.apply(o)==='[object Array]';}
function to_array(o){var a=[],k;for(k in o){if(is_own(o,k)){a.push(k);}}
return a;}
itself.data=function(){var data={functions:[]},fu,globals,implieds=[],f,i,j,members=[],n,unused=[],v;if(itself.errors.length){data.errors=itself.errors;}
if(jsonmode){data.json=true;}
for(n in implied){if(is_own(implied,n)){implieds.push({name:n,line:implied[n]});}}
if(implieds.length>0){data.implieds=implieds;}
if(urls.length>0){data.urls=urls;}
globals=to_array(scope);if(globals.length>0){data.globals=globals;}
for(i=1;i<functions.length;i+=1){f=functions[i];fu={};for(j=0;j<functionicity.length;j+=1){fu[functionicity[j]]=[];}
for(n in f){if(is_own(f,n)&&n.charAt(0)!=='('){v=f[n];if(v==='unction'){v='unused';}
if(is_array(fu[v])){fu[v].push(n);if(v==='unused'){unused.push({name:n,line:f['(line)'],'function':f['(name)']});}}}}
for(j=0;j<functionicity.length;j+=1){if(fu[functionicity[j]].length===0){delete fu[functionicity[j]];}}
fu.name=f['(name)'];fu.param=f['(params)'];fu.line=f['(line)'];fu.last=f['(last)'];data.functions.push(fu);}
if(unused.length>0){data.unused=unused;}
members=[];for(n in member){if(typeof member[n]==='number'){data.member=member;break;}}
return data;};itself.report=function(option){var data=itself.data();var a=[],c,e,err,f,i,k,l,m='',n,o=[],s;function detail(h,array){var b,i,singularity;if(array){o.push('<div><i>'+h+'</i> ');array=array.sort();for(i=0;i<array.length;i+=1){if(array[i]!==singularity){singularity=array[i];o.push((b?', ':'')+singularity);b=true;}}
o.push('</div>');}}
if(data.errors||data.implieds||data.unused){err=true;o.push('<div id=errors><i>Error:</i>');if(data.errors){for(i=0;i<data.errors.length;i+=1){c=data.errors[i];if(c){e=c.evidence||'';o.push('<p>Problem'+(isFinite(c.line)?' at line '+
c.line+' character '+c.character:'')+': '+c.reason.entityify()+'</p><p class=evidence>'+
(e&&(e.length>80?e.slice(0,77)+'...':e).entityify())+'</p>');}}}
if(data.implieds){s=[];for(i=0;i<data.implieds.length;i+=1){s[i]='<code>'+data.implieds[i].name+'</code>&nbsp;<i>'+
data.implieds[i].line+'</i>';}
o.push('<p><i>Implied global:</i> '+s.join(', ')+'</p>');}
if(data.unused){s=[];for(i=0;i<data.unused.length;i+=1){s[i]='<code><u>'+data.unused[i].name+'</u></code>&nbsp;<i>'+
data.unused[i].line+'</i> <code>'+
data.unused[i]['function']+'</code>';}
o.push('<p><i>Unused variable:</i> '+s.join(', ')+'</p>');}
if(data.json){o.push('<p>JSON: bad.</p>');}
o.push('</div>');}
if(!option){o.push('<br><div id=functions>');if(data.urls){detail("URLs<br>",data.urls,'<br>');}
if(xmode==='style'){o.push('<p>CSS.</p>');}else if(data.json&&!err){o.push('<p>JSON: good.</p>');}else if(data.globals){o.push('<div><i>Global</i> '+
data.globals.sort().join(', ')+'</div>');}else{o.push('<div><i>No new global variables introduced.</i></div>');}
for(i=0;i<data.functions.length;i+=1){f=data.functions[i];o.push('<br><div class=function><i>'+f.line+'-'+
f.last+'</i> '+(f.name||'')+'('+
(f.param?f.param.join(', '):'')+')</div>');detail('<big><b>Unused</b></big>',f.unused);detail('Closure',f.closure);detail('Variable',f['var']);detail('Exception',f.exception);detail('Outer',f.outer);detail('Global',f.global);detail('Label',f.label);}
if(data.member){a=to_array(data.member);if(a.length){a=a.sort();m='<br><pre id=members>/*members ';l=10;for(i=0;i<a.length;i+=1){k=a[i];n=k.name();if(l+n.length>72){o.push(m+'<br>');m='    ';l=1;}
l+=n.length+2;if(data.member[k]===1){n='<i>'+n+'</i>';}
if(i<a.length-1){n+=', ';}
m+=n;}
o.push(m+'<br>*/</pre>');}
o.push('</div>');}}
return o.join('');};itself.jslint=itself;itself.edition='2010-09-13';return itself;}());(function(a){var e,i,input;if(!a[0]){print("Usage: jslint.js file.js");quit(1);}
input=readFile(a[0]);if(!input){print("jslint: Couldn't open file '"+a[0]+"'.");quit(1);}
if(!JSLINT(input,{predef:["$","jQuery"],maxerr:100,evil:true,browser:true,eqeqeq:true,immed:true,newcap:true,nomen:true,onevar:true,es5:true,rhino:true,undef:true,white:false,devel:true})){for(i=0;i<JSLINT.errors.length;i+=1){e=JSLINT.errors[i];if(e){print('Lint at line '+e.line+' character '+
e.character+': '+e.reason);print((e.evidence||'').replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1"));print('');}}
quit(2);}else{print("jslint: No problems found in "+a[0]);quit();}}(arguments));
