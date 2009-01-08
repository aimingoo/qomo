/********************************************************
Qomolangma OpenProject v1.0
 [v1.0 release 2007.01.31]
********************************************************/


$QomoCoreFunction=function(name){return new Function("return 'function "+name+"() {\\n    [qomo_core code]\\n}'");}
if(window.execScript==null){window.execScript=function(script,type){window.eval(script,type);}}
$debug=function(){};function Ajax(){var http=(window.XMLHttpRequest?function(){return new XMLHttpRequest()}:window.ActiveXObject?function(){var PROGIDS=new Array('MSXML2.XMLHTTP.7.0','MSXML2.XMLHTTP.6.0','MSXML2.XMLHTTP.5.0','MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','MSXML3.XMLHTTP','Microsoft.XMLHTTP');for(var i=0;i<PROGIDS.length;i++){try{return new ActiveXObject(PROGIDS[i])}catch(e){};}}:function(){})();if(!http){$debug("Qomo's ajax core initialize failed!");throw new Error([0,'Can\'t Find XMLHTTP Object!']);}
return http;}
$import=function(){var _SYS_TAG=/\/Qomo\.js$/;var _r_path=/[^\/]*$/;var _r_protocol=/^\w+:\/{2,}[^\/]+\//;function $JS(){var all=document.getElementsByTagName('script');for(var i=all.length-1;i>=0;i--){if(typeof all[i].readyState!='undefined'){if(all[i].readyState=='interactive')return all[i].src;}
else if(_SYS_TAG.test(all[i].src)){return all[i].getAttribute('src');}}
return'';}
function $RURL(url){if(url.indexOf('./')==-1)return url;var
d='/',p1=(url.charAt(0)==d?d:''),p2=(url.charAt(url.length-1)==d?d:'');if(url.search(_r_protocol)!=-1){p1=RegExp.lastMatch;url=url.substr(p1.length);}
for(var i=0,v=[],a=url.split(d);i<a.length;i++){switch(a[i]){case'..':v[(v.length>0&&v[v.length-1]!='..')?'pop':'push'](a[i]);case'.':case'':break;default:v.push(a[i]);}}
p2=v.join(d)+p2;return p1+(p2=='/'?'':p2);}
var _sys={'scripts':{},'curScript':'','activeJS':$JS,'parseRelativeURL':$RURL,'bodyDecode':function(ajx){return ajx.responseText},'docBase':function(){return'';}(),'srcBase':function(){return $JS().replace(_r_path,'');}(),'pathBase':function(){var s=_sys.curScript||_sys.activeJS();if(!s)return _sys.docBase;s=s.replace(_r_path,'');return(s.charAt(0)=='/'?'':_sys.docBase)+s;},'transitionUrl':function(url){return _sys.parseRelativeURL((url.length==0||url.charAt(0)=='/')?url:_sys.curScript?_sys.curScript.replace(_r_path,url):_sys.pathBase()+url);}}
var ajx=new Ajax();var ajaxLoad=function(src){ajx.open("GET",src,false);ajx.send(null);if(ajx.status==200||ajx.status==0)return _sys.bodyDecode(ajx);throw new Error([1,"AjaxLoad error at $import, Status: ",ajx.status]);}
var _stack=[];var _load_and_exec=function(src){src=_sys.transitionUrl(src);if(typeof _sys.scripts[src]=='undefined'){try{_sys.scripts[src]=null;var script=ajaxLoad(src);_stack[_stack.length]=_sys.curScript;_sys.curScript=src;try{window.execScript(script,'JavaScript');}
finally{if(_stack.length>0){_sys.curScript=_stack[_stack.length-1];_stack.length--;}
else{_sys.curScript='';}}}
catch(e){$debug('<P>$import() failed: ',src,'<BR /><DIV color="red">',e.message,'</DIV></P>');throw e;}}}
function _import(target,condition){if(arguments.length<2||condition){_load_and_exec(target);}}
_import.setActiveUrl=function(url){}
_import.get=function(n){return(n=='perf_exec_stub'?_load_and_exec:eval('_sys[n]'))}
_import.set=function(n,v){if(n=='perf_exec_stub'){_load_and_exec=v;}
else{eval('_sys[n] = v');if(n=='docBase'){for(var i=0;i<_stack.length;i++){if(!_stack[i])continue;_stack[i]=_sys.parseRelativeURL(_sys.docBase+_stack[i]);}}}}
_import.OnSysInitialized=function(){delete _import.set;delete _import.get;delete _import.OnSysInitialized;if(typeof($profilers)!=='undefined'&&$profilers.ResetImport)$profilers.ResetImport();this.setActiveUrl('');}
return _import;}();$inline=function(){var $getter=$import.get;var bodyDecode=function(ajx){return $getter('bodyDecode')(ajx)}
var transitionUrl=function(src){return $getter('transitionUrl')(src)}
var ajx=new Ajax();function ajaxLoad(src){ajx.open("GET",transitionUrl(src),false);ajx.send(null);if(ajx.status==200||ajx.status==0)return bodyDecode(ajx);throw new Error([1,"AjaxLoad error at $inline,  Status: ",ajx.status]);}
var cache={};return function(src,condition){if(arguments.length<2||condition){return((src in cache)?cache[src]:cache[src]=ajaxLoad(src));}}}();void function(){var $setter=$import.set;$import.setActiveUrl=function(url){$setter('curScript',url);}}();JoPoint=JoPoints=function(){this.add=this.items=this.names=this.getLength=this.assign=this.unassign=function(){};this.weaving=function(n,f){return f}}
function isNamespace(n){if(n===null)return false;if(typeof n!='object')return false;switch(typeof n.constructor){case'function':return false;case'object':{if(isNamespace(n.constructor))return true;return n.constructor.constructor==String;}
case'string':return true;default:return false;}}
$map=function(){var $getter=$import.get;var parseRelativeURL=$getter('parseRelativeURL');var transitionUrl=$getter('transitionUrl');var scripts=$getter('scripts');var activeJS=$getter('activeJS');var docBase=$getter('docBase');var $third='Qomo.Thirdparty';function curScript(){return $getter('curScript');}
function pathBase(){return $getter('pathBase')();}
$import.set('activeSpc',function(){var s=curScript()||activeJS();if(s){s=s.substr(0,s.lastIndexOf('/')+1);s=$p2n((s.charAt(0)=='/'?'':docBase)+s);if(s)return s;}
return $third;});$import.set('transitionUrl',function(target){if(isNamespace(target)){var p=$n2p(target),url=p+'package.xml';scripts[url]=null;}
return transitionUrl(target);});function $name(name){return new Function("return '"+name+"'");}
var $map$={signpost:function(p){var i,imax,sp,n=p.length;while(n>1){if(sp=this[n]){for(i=0,imax=sp.paths.length;i<imax;i++)
if(sp.paths[i]==p)return sp.names[i];}
p=p.substr(0,p.lastIndexOf('/',n-2)+1);n=p.length;}
return null;},remove:function(p){var sp;if(sp=this[p.length]){for(var i=0,imax=sp.paths.length;i<imax;i++){if(sp.paths[i]==p){sp.names.splice(i,1);sp.paths.splice(i,1);return true;}}}
return false;},insert:function(p,n){if($p2n(p)==null){if(sp=this[p.length]){sp.names.push(n);sp.paths.push(p);}
else{this[p.length]={names:new Array(n),paths:new Array(p)};}}}};function $n2p(n){if(n){while(n.constructor.constructor!=String)n=n.constructor;return n.constructor;}}
function $p2n(p){if(p==''&&$n2p(Qomo)=='')return Qomo;var sp=$map$.signpost(p);if(!sp)return null;if(sp.constructor==p)return sp;var n=p.substring(sp.constructor.length,p.length-1).replace('/','.');try{return eval(sp+'.'+n);}
catch(e){return null;}}
function $mapx(s){var n,i,p='',$spc='',$ss=s.split('.')
for(i=0;i<$ss.length;i++,$spc+='.'){$spc+=$ss[i];if(n=eval($spc)){p=n.constructor;continue;}
while(true){window.execScript($spc+'={};','JavaScript');p+=$ss[i]+'/';n=eval($spc);n.constructor=p;n.toString=$name($spc);if(++i>=$ss.length)break;$spc+='.'+$ss[i];}}}
var $attr$={'$n2p':$n2p,'$p2n':$p2n,'$mapx':$mapx}
function _map(name,path,base){if(path){path=parseRelativeURL((path.charAt(0)=='/'?'':base||pathBase())+path);}
if(isNamespace(name)){if($map$.remove($n2p(name))){};}
else{var $ss=name.split('.');if($ss.length==0)return;var $spc=$ss[0];try{eval($spc);}
catch(e){window.execScript($spc+'={};','JavaScript');eval($spc).constructor="";eval($spc).toString=$name($spc);}
for(var i=1,imax=$ss.length;i<imax;i++){$spc+='.'+$ss[i];if(eval($spc))continue;while(true){window.execScript($spc+'={};','JavaScript');eval($spc).constructor="";eval($spc).toString=$name($spc);if(++i>=$ss.length)break;$spc+='.'+$ss[i];}}}
name=eval(name);name.constructor=path;if(path)$map$.insert(path,name);}
_map.get=function(n){return eval('$attr$[n]');}
_map.set=function(n,v){return eval('$attr$[n] = v');}
_map.OnSysInitialized=function(){delete _map.set;delete _map.get;delete _map.OnSysInitialized;}
_map($third,'');$third=eval($third);return _map;}();$n2p=$map.get('$n2p');$p2n=$map.get('$p2n');$mapx=$map.get('$mapx');$map.OnSysInitialized();function isAlias(n){return isNamespace(n.constructor);}
function $alias(alias,name){$map(alias,'');eval(alias).constructor=name;}
$map('Qomo','./',function(){return $import.get('docBase')+$import.get('srcBase');}());$map('Qomo.System','Framework/',$n2p(Qomo));$mapx('Qomo.System.Common');$mapx('Qomo.System.RTL');$map('Qomo.UI','Components/',$n2p(Qomo));$mapx('Qomo.UI.Graphics');$mapx('Qomo.UI.Controls');$map('Qomo.DB','');$map('Qomo.DB.LocalDB','Components/LocalDB/',$n2p(Qomo));$alias('Qomo.RTL',Qomo.System.RTL);NullFunction=Hidden=function(){};CustomArguments=function(){this.result=Array.prototype.slice.call(arguments,0)};BreakEventCast=function(v){this.result=v};EIsNotAspect=[8071,'JoPoint Connect to a non-Aspect object.'];void function(){if(typeof($assert)!='function')$assert=NullFunction;if(typeof($QomoCoreFunction)!='function')$QomoCoreFunction=function(n){return NullFunction};if(typeof($Abstract)!='function')Abstract=function(){throw new Error('Call Abstract Method.')}}();Array.prototype.remove=function(i,n){if(arguments.length==1){if((i=this.indexOf(i))==-1)return null;n=1;}
return this.splice(i,n);}
Array.prototype.clear=function(){if(this.length>0)this.splice(0,this.length);}
Array.prototype.insert=function(i,v){if(arguments.length>2){this.splice.call(arguments,1,0,0);this.splice.apply(this,arguments);}
else if(v instanceof Array){v.unshift(i,0);this.splice.apply(this,v);v.splice(0,2);}
else{this.splice(i,0,v)}}
Array.prototype.add=function(item){this.push(item);}
Array.prototype.addRange=function(items){this.push.apply(this,items)}
Array.prototype.contains=function(item){var index=this.indexOf(item);return(index>=0);}
void function(){var _r_strfmt=/%(.)/g;var _replace=String.prototype.replace;String.prototype.format=function(){var i=0,args=arguments,n=args.length;return(!n?this:this.replace(_r_strfmt,function($0,$1){if(i==n)return $0;switch($1){case's':case'S':return args[i++];case'%':return $1;default:return(isNaN($1)?$0:args[$1]);}}));}
String.format=function(s,arr){return String.prototype.format.apply(s.toString(),arr);}
var _removeBlock=function(rgArray,setNewStr,lastIndex){lastIndex=lastIndex||0;for(var rBegin,v1,i=0,imax=rgArray.length-1;i<imax;i++){rBegin=rgArray[i];rBegin.lastIndex=lastIndex;if((v1=rBegin.exec(this))&&(v1.index>=0)){var v2,rEnd=rgArray[imax];rEnd.lastIndex=rBegin.lastIndex;if(!(v2=rEnd.exec(this))||v2.index<0)break;return this.substr(0,v1.index)+setNewStr+this.substr(rEnd.lastIndex);}}
return this;}
String.prototype.replace=function(rgExp,replaceText){return(rgExp instanceof Array?_removeBlock:_replace).apply(this,arguments);}
String.prototype.endsWith=function(suffix){return(this.substr(this.length-suffix.length)==suffix);}
String.prototype.startsWith=function(prefix){return(this.substr(0,prefix.length)==prefix);}
String.prototype.trimLeft=function(){return this.replace(/^\s*/,"");}
String.prototype.trimRight=function(){return this.replace(/\s*$/,"");}
String.prototype.trim=function(){return this.trimRight().trimLeft();}}();format=String.format;Number.prototype.toString=function(){var _toString=Number.prototype.toString;return function(radix,length){var result=_toString.apply(this,arguments).toUpperCase();var length=length||0;return(result.length>=length?result:(new Array(length-result.length)).concat(result).join('0'));}}();void function(){var _f_toString=Function.prototype.toString;var _r_function=/^function\b *([$\w\u00FF-\uFFFF]*) *\(/;Function.prototype.toString=function(){return _f_toString.call(this).replace(_r_function,'function (');}}();void function(){var _Error=Error;Error=function(v1,v2){return(!(v1&&v1.constructor===Array)?new _Error(v1,v2):new _Error(v1[0],String.format(v1[1],v1.slice(2)),v2));}}();MuEvent=function(){var hidden=$QomoCoreFunction('MuEvent');var funcs=['add','addMethod','clear','reset','close'];var GetHandle={};var all={length:0,search:function(ME){var i=ME(GetHandle),me=all[i];if(me&&me['event']===ME)return me;}}
function add(foo){var e=all.search(this);if(e)e[e.length++]={action:foo,sender:undefined}}
function addMethod(obj,foo){var e=all.search(this);if(e)e[e.length++]={action:foo,sender:obj}}
function clear(){var e=all.search(this);if(e)while(e.length>0)delete e[--e.length];}
function reset(foo){var e=all.search(this);if(e){e.length=1;e[0]={action:foo,sender:undefined};}}
function close(){var e=all.search(this);if(e){for(var i=0;i<funcs.length;i++)delete this[funcs[i]];delete e.event;}}
function run(handle,args){for(var v,v2,i=0,e=all[handle],len=e.length;i<len;i++){if((v2=e[i].action.apply((e[i].sender?e[i].sender:this),args))!==undefined){if(v2 instanceof BreakEventCast){if(v2.result!==undefined)v=v2.result;break;}
v=v2;}}
return v;}
function _MuEvent(){var handle=all.length++;var ME=function($E){if($E===GetHandle)return handle;if(all[handle].length>0)return run.call(this,handle,arguments)}
ME.constructor=_MuEvent;ME.toString=hidden;this.event=ME;all[handle]=this;var f,i=0,imax=arguments.length;while(f=funcs[i++])ME[f]=eval(f);for(i=0;i<imax;i++)ME.add(arguments[i]);return ME;}
for(var f,i=0;i<funcs.length;i++){eval(f=funcs[i]).toString=$QomoCoreFunction('MuEvent.'+f);}
_MuEvent.toString=hidden;_MuEvent.prototype.length=0;return _MuEvent;}();$ArrayFrom=function(e,i,a){a[i]=this[i];}
$import.setActiveUrl("Framework/RTL/Object.js");var
ECallClassBadArguments=[8101,'Arguments error  for Class().'];ERegClassNoname=[8102,'With call Class(), lost class name .'];EAccessSafeArea=[8104,'Try Access Safe area.'];EInvalidProtectArea=[8105,'Protect area invalid.'];EInvalidInheritedContext=[8106,'this.Inherited() need call in method.'];EInvalidInherited=[8107,'Inherited method name invalid or none inherited.'];EAccessSecurityRules=[8108,'Access security rules!'];EAccessInvaildClass=[8109,'Class invaild: lost typeinfo!'];EWriteUndefinedAttr=[8110,'Try write undefined attribute!'];EInvalidClass=[8111,'Class or ClassName Invalid.'];ECreateInstanceFail=[8112,'Create Instance fail.'];EAttributeCantRead=[8112,'The "%s" attribute can\'t read for %s.'];EAttributeCantWrite=[8112,'The "%s" attribute can\'t write for %s.'];var
_r_event=/^On.+/;_r_attribute=/^([gs]et)(.+)/;Attribute=function(){function hasMethod(p){if(typeof p!='function')return false;switch(p.caller){case this.get:case this.set:return true}
switch(p){case this.Create:case this.get:case this.set:case this.inherited:return true}
for(var n in this)if(this[n]===p)return true;}
function cantRead(){throw new Error(EAttributeCantRead.concat([n,this.ClassInfo.ClassName]))}
function cantWrite(){throw new Error(EAttributeCantWrite.concat([n,this.ClassInfo.ClassName]))}
function p_getAttr(n){if(!hasMethod.call(this,p_getAttr.caller.caller))
throw new Error(EAttributeCantRead.concat([n,this.ClassInfo.ClassName]));return this.get();}
function p_setAttr(v,n){if(!hasMethod.call(this,p_setAttr.caller.caller))
throw new Error(EAttributeCantWrite.concat([n,this.ClassInfo.ClassName]));this.set(v);}
var tag_clone={};return function(base,name,value,tag){var i,argn=arguments.length;var Constructor=Attribute.caller;var cls=Constructor.caller;if(argn>3){tag=tag.toLowerCase();if((tag.indexOf('p')>-1)){base['get'+name]=p_getAttr;base['set'+name]=p_setAttr;}
else{base['get'+name]=cantRead;base['set'+name]=cantWrite;}
for(var i=0;i<tag.length;i++){switch(tag.charAt(i)){case'r':delete base['get'+name];break;case'w':delete base['set'+name];break;}}
if(tag.indexOf('c')>-1)base['get'+name]=tag_clone;}
return(cls&&cls.set&&cls.set(name,value));}}();Class=function(){var _classinfo_={};var _undefined_={};var $getter_str=$QomoCoreFunction('Attribute.get');var $setter_str=$QomoCoreFunction('Attribute.set');var $inherited_str=$QomoCoreFunction('inherited');var $inherited_invalid=function(){throw new Error(EInvalidInherited)};var $cc_attr={r:"_proto_['get'+n]!==$cc_attr.getInvalid",w:"_proto_['set'+n]!==$cc_attr.setInvalid",c:"_proto_['get'+n]===$cc_attr.getClone",p:"_proto_['get'+n]===$cc_attr.getProtect || _proto_['set'+n]===$cc_attr.setProtect",'*':"_proto_['get'+n]!==$cc_attr.getInvalid && _proto_['set'+n]!==$cc_attr.setInvalid",'undefined':"true"};Attribute($cc_attr,'Invalid','','');Attribute($cc_attr,'Protect','','p');Attribute($cc_attr,'Clone','','c');var _joinpoints_=new JoPoints();_joinpoints_.add('Initializtion');_joinpoints_.add('Initialized');function ClassTypeinfo(cls,Attr){this.class_=cls;this.$Attr_=Attr;this.next__=_classinfo_[cls.ClassName];}
function getClassTypeinfo(cls){var n=cls.ClassName,p=_classinfo_[n];while(p&&p.class_!==cls)p=p.next__;if(p===undefined)throw new Error(EAccessInvaildClass);return p;}
function setClassTypeinfo(cls,Attr,instance){var n=cls.ClassName,p=_classinfo_[n];while(p&&p.class_!==cls)p=p.next__;if(p!==undefined)throw new Error(EInvalidClass);cls.Create.prototype=instance;_classinfo_[n]=new ClassTypeinfo(cls,Attr);}
function getPrototype(cls){return(cls?cls.Create.prototype:{})}
function getAttrPrototype(cls){return getClassTypeinfo(cls).$Attr_}
function getPropertyName(p,obj){for(var n in obj)if(obj[n]===p)return n}
function ClassDataBlock(){var Attr=function(){};var _attributes=this;var _events=[];var _maps={};function all(n){switch(n){case'event':return _events;}}
function getAttribute(n){return Attr[n]}
function setAttribute(n,v){Attr[n]=v}
var Name=arguments[1];var Parent=arguments[0];var cls=function(Constructor){var base,parent=getPrototype(cls.ClassParent);if(cls.ClassParent)Attr.prototype=getAttrPrototype(cls.ClassParent);setClassTypeinfo(cls,Attr=new Attr(),base=new Constructor());for(var i in base){if(base[i]instanceof Function){if(_r_event.test(i))_events.push(i);if(_r_attribute.exec(i)){Attr[i]=base[i];delete base[i];if(!(RegExp.$2 in Attr))Attr[RegExp.$2]=undefined;}}}}
function inheritedAttribute(foo){var n=getPropertyName(foo,Attr);if(n===undefined)return;var p,v=[],$cls=Parent;while($cls){p=getAttrPrototype($cls);if(p.hasOwnProperty(n))v.push(p[n]);$cls=$cls.ClassParent;}
if(v[0]!==foo)v.unshift(foo);return v;}
function getInheritedMap(method){if(!(method instanceof Function))return[method,$inherited_invalid];for(var i=0,len=_maps.length;i<len;i++)if(_maps[i][0]===method)return _maps[i];var a=inheritedAttribute(method);if(!a){var p,n,a=[method],$cls=cls;var isSelf=getInheritedMap.caller.caller===method;if(n=getPropertyName(method,this)){if(method===getPrototype($cls)[n])a.pop();if(!isSelf)a.push(method);while($cls){p=getPrototype($cls);if(p.hasOwnProperty(n))a.push(p[n]);$cls=$cls.ClassParent;}}}
a.push($inherited_invalid);return(_maps[len]=a);}
cls.OnClassInitializtion=_joinpoints_.weaving('Initializtion',function(Constructor){if(Parent)Constructor.prototype=getPrototype(Parent);this.all=all;this.map=getInheritedMap;this.get=getAttribute;this.set=setAttribute;this.attrAdapter=getAttribute;});cls.OnClassInitialized=_joinpoints_.weaving('Initialized',function(IDB){delete this.all;delete this.map;delete this.get;delete this.set;delete this.attrAdapter;delete this.OnClassInitializtion;delete this.OnClassInitialized;if(Parent)IDB.prototype=getAttrPrototype(cls);});cls.ClassName='T'+Name;cls.ClassInfo=cls;cls.ClassParent=Parent;cls.toString=$QomoCoreFunction(cls.ClassName);return cls;}
_inline_object_registerToActiveNamespace:{var $import_getter=$import.get;}
function _Class(Parent,Name){var args=arguments;if(args.length==0)throw new Error(ECallClassBadArguments);if(args.length==1){if((typeof args[0]=='string')||(args[0]instanceof String)){return _Class((args[0]=='Object'?null:TObject),args[0]);}
throw new Error(ECallClassBadArguments);}
var Constructor=eval(Name);if(!(Constructor instanceof Function))throw new Error(ERegClassNoname);var cls=new ClassDataBlock(Parent,Name);cls.OnClassInitializtion(Constructor);var $all=cls.all;var $map=cls.map;var $attr=cls.attrAdapter;function InstanceDataBlock(){var data_=this;var cache=[];this.get=function(n){if(arguments.length==0){var args=this.get.caller.arguments;n=args.length==1?args[0]:args[1];if(this.get.caller!==$attr((args.length==1?'get':'set')+n))return;}
else{var f=$attr('get'+n);if(f)return f.call(this,n);}
return data_[n];}
this.set=function(n,v){if(arguments.length==1){v=n;var args=this.set.caller.arguments;n=args.length==1?args[0]:args[1];if(this.set.caller!==$attr((args.length==1?'get':'set')+n))return;}
else{var f=$attr('set'+n);if(f)return f.call(this,v,n);}
if(n in data_)return void(data_[n]=v);throw new Error(EWriteUndefinedAttr);}
this.inherited=function(method){var f=this.inherited.caller,args=f.arguments;if(method){if(typeof method=='string'||method instanceof String)f=this[method];else if(method instanceof Function)f=method;else f=null;if(arguments.length>1){args=(arguments[1]instanceof CustomArguments)?arguments[1].result:Array.prototype.slice.call(arguments,1);}}
if(!f)$inherited_invalid();for(var p,i=0;i<cache.length;i++){if(f===cache[i][0]){p=cache[i];p.shift();return p[0].apply(this,args);}}
var p=cache[cache.length]=$map.call(this,f).slice(1);try{var v=p[0].apply(this,args);}
finally{cache.remove(p);}
return v;}
this.inherited.toString=$inherited_str;this.get.toString=$getter_str;this.set.toString=$setter_str;}
cls.Create=function(){if(this===cls){var i,v=arguments,n=v.length,s='new this.Create(';if(n>0)for(i=1,s+='v[0]';i<n;i++)s+=', v['+i+']';return eval(s+');');}
else if(this&&this.constructor===cls.Create){var Data=new InstanceDataBlock();this.get=Data.get;this.set=Data.set;this.inherited=Data.inherited;var all=$all('event');for(var i=0,imax=all.length;i<imax;i++)this[all[i]]=new MuEvent();if(this.Create)this.Create.apply(this,arguments);}
else{throw new Error(ECreateInstanceFail);}}
cls(Constructor);cls.OnClassInitialized(InstanceDataBlock);cls.Create.toString=function(){return Constructor.toString()};cls.Create.prototype.constructor=cls.Create;cls.Create.prototype.ClassInfo=cls;eval(Name+'= cls.Create');_inline_object_registerToActiveNamespace:{var activeSpc=$import_getter('activeSpc');if(activeSpc){var spc=activeSpc();cls.SpaceName=spc.toString();spc[cls.ClassName]=cls;}}
return cls;}
return _Class;}();void function(){var _RTLOBJECT=new Object();Object=function(){}
Object.prototype=new _RTLOBJECT.constructor();}();TObject=Class('Object');_get=function(n){return _get.caller.caller.get(n)}
_set=function(n,v){return _set.caller.caller.set(n,v)}
_cls=function(){return _cls.caller.caller}
$import.OnSysInitialized();