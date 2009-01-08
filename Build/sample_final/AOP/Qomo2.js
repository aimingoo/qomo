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
var cache={};return function(src,condition){if(arguments.length<2||condition){return((src in cache)?cache[src]:cache[src]=ajaxLoad(src));}}}();void function(){var $setter=$import.set;$import.setActiveUrl=function(url){$setter('curScript',url);}}();var
EQueryObjectInvalid=[8081,'Can\'t query interface with Null object or undefined value.'];EInterfaceNotExist=[8082,'Query interface is not exist.'];ECallAbstract=[8083,'Call Abstract Method.'];if(!('indexOf'in Array.prototype)){Array.prototype.indexOf=function(v){for(var i=(arguments.length>1?arguments[1]:0),len=this.length;i<len;i++)
if(this[i]==v)return i;return-1;}}
Abstract=function(){throw new Error(ECallAbstract)}
IImport=function(){}
IMuEvent=function(){}
INamedEnumer=function(){this.getLength=Abstract;this.items=Abstract;this.names=Abstract;}
IJoPoint=function(){this.assign=Abstract;this.unassign=Abstract;}
IJoPoints=function(){INamedEnumer.call(this);}
IClass=function(){this.hasAttribute=Abstract;this.hasOwnAttribute=Abstract;}
IAttrProvider=function(){this.hasAttribute=Abstract;this.hasOwnAttribute=Abstract;}
IAttributes=function(){INamedEnumer.call(this);}
IObject=function(){IAttrProvider.call(this);this.hasEvent=Abstract;this.hasProperty=Abstract;this.hasOwnProperty=Abstract;}
IInterface=function(){this.QueryInterface=Abstract;}
IClassRegister=function(){this.hasClass=Abstract;}
IAspect=function(){this.supported=Abstract;this.assign=Abstract;this.unassign=Abstract;this.merge=Abstract;this.unmerge=Abstract;this.combine=Abstract;this.uncombine=Abstract;this.OnIntroduction=Abstract;this.OnBefore=Abstract;this.OnAfter=Abstract;this.OnAround=Abstract;}
IAspectedClass=function(){IClass.call(this);IJoPoints.call(this);}
Interface=function(){var handle='_INTFHANDLE_';var $Intfs={length:0};var $Aggrs=[];var $Aggri=[];function getAggrInterfaces(func){var i=$Aggrs.indexOf(func);if(i>-1)return $Aggri[i];}
function warpInterface(intf){var h=intf[handle];if((h===undefined)||!$Intfs[h]||$Intfs[h][0]!==intf){h=intf[handle]=$Intfs.length++;$Intfs[h]=[intf];}
return $Intfs[h];}
warpInterface(IInterface);warpInterface(IJoPoint);warpInterface(IMuEvent);warpInterface(IJoPoints);function isInterface(intf){if(intf instanceof Function){var h=intf[handle];return(h!==undefined&&$Intfs[h]&&$Intfs[h][0]===intf);}
return false;}
function isImplemented(intf){switch(intf){case IInterface:return true;case IJoPoint:return this instanceof JoPoint;case IMuEvent:return this instanceof MuEvent;}
var cls=this.ClassInfo;while(cls){if($Intfs[intf[handle]].indexOf(cls)>-1)return true;cls=cls.ClassParent;}
return false;}
function _Interface(obj){if(obj===undefined||obj===null)return-1;for(var i=1,args=arguments,argn=args.length;i<argn;i++){var all=warpInterface(args[i]);if(all.indexOf(obj)==-1)all.push(obj);}
if(obj instanceof Function){if(_Interface.caller===Aggregate&&this!==Aggregate){var i=$Aggrs.indexOf(obj);if(i==-1){$Aggrs.push(obj);$Aggri.push(this);return this;}
for(var n in this){if(this.hasOwnProperty(n)&&!$Aggri[i].hasOwnProperty(n))$Aggri[i][n]=this[n];}
return $Aggri[i];}}}
_Interface.QueryInterface=function(obj,intf){if(obj===undefined||obj===null)throw new Error(EQueryObjectInvalid);if(!isInterface(intf))throw new Error(EInterfaceNotExist);if(!isImplemented.call(obj,intf)){var intfs,foo=(obj instanceof Function?obj:obj.constructor);return((intfs=getAggrInterfaces(foo))?intfs.GetInterface(obj,intf):void null);}
var p=obj,f=new intf();if(intf===IInterface){f.QueryInterface=function(intf){return Interface.QueryInterface(p,intf)}}
else{var slot=['f["',,'"]=function(){return p["',,'"].apply(p, arguments)}'];for(var i in f){slot[1]=slot[3]=i;eval(slot.join(''));}}
return f;}
_Interface.RegisterInterface=_Interface;_Interface.IsInterface=isInterface;return _Interface;}();RegisterInterface=Interface.RegisterInterface;QueryInterface=Interface.QueryInterface;Aggregate=function(){var handle='_INTFHANDLE_';function Interfaces(args){for(var i=1;i<args.length;i++){this[args[i][handle]]=new args[i];}}
Interfaces.prototype.GetInterface=function(intf){if(arguments.length==1)return this[intf[handle]];var _intf=arguments[1];if(_intf){var ff,p=arguments[0],f=new _intf();if(_intf===IInterface){f.QueryInterface=function(intf){return Interface.QueryInterface(p,intf)}}
else{if(!(ff=this[_intf[handle]]))return;var slot=['f["',,'"]=function(){return ff["',,'"].apply(p, arguments)}'];for(var i in f){slot[1]=slot[3]=i;eval(slot.join(''));}}
return f;}}
function _Aggregate(foo){if(foo instanceof Function){Interface.RegisterInterface.apply(_Aggregate,arguments);return Interface.RegisterInterface.call(new Interfaces(arguments),foo);}}
return _Aggregate;}();JoPoint=function(){function _JoPoint(){this.items=[];this.all={};}
_JoPoint.prototype.assign=function(n,a){if(!this.all[n])this.items.push(n);this.all[n]=Interface.QueryInterface(a,IAspect);}
_JoPoint.prototype.unassign=function(n){this.items.remove(n);delete this.all[n];}
return _JoPoint;}();JoPoints=function(){function _JoPoints(){for(var i=0;i<arguments.length;i++,this.length++)this[(this[i]=arguments[i])]=new JoPoint();}
_JoPoints.prototype.length=0;_JoPoints.prototype.pt=function(n){return(this.hasOwnProperty(n)?this[n]:undefined)}
_JoPoints.prototype.add=function(n){this[(this[this.length++]=n)]=new JoPoint()}
_JoPoints.prototype.items=function(i){var pt=((typeof i=='number'||i instanceof Number)?this[this[i]]:this.pt(i));return(!pt?new IJoPoint():Interface.QueryInterface(pt,IJoPoint));}
_JoPoints.prototype.weaving=function(n,f){var $n=n,$f=f,$pts=this;return function(){var $pt=$pts.pt($n);if(!$pt||($pt.items.length==0))return $f.apply(this,arguments);var names=$pt.items,imax=names.length,point=$n;var _value,_intro=true,_cancel=false;for(var i=0;_intro&&i<imax;i++)_intro=($pt.all[names[i]].OnIntroduction(this,names[i],point,arguments)!==false);if(_intro)for(var i=0;i<imax;i++)$pt.all[names[i]].OnBefore(this,names[i],point,arguments);if(_intro)for(var i=0;!_cancel&&i<imax;i++)_cancel=($pt.all[names[i]].OnAround(this,names[i],point,arguments)===false);if(!_cancel)_value=$f.apply(this,arguments);if(_intro)for(var i=0;i<imax;i++)$pt.all[names[i]].OnAfter(this,names[i],point,arguments,_value);return _value;}}
return _JoPoints;}();NullFunction=Hidden=function(){};CustomArguments=function(){this.result=Array.prototype.slice.call(arguments,0)};BreakEventCast=function(v){this.result=v};EIsNotAspect=[8071,'JoPoint Connect to a non-Aspect object.'];void function(){if(typeof($assert)!='function')$assert=NullFunction;if(typeof($QomoCoreFunction)!='function')$QomoCoreFunction=function(n){return NullFunction};if(typeof($Abstract)!='function')Abstract=function(){throw new Error('Call Abstract Method.')}}();Array.prototype.remove=function(i,n){if(arguments.length==1){if((i=this.indexOf(i))==-1)return null;n=1;}
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
var
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
_inline_object_regAllInterfaceForClass:{if(arguments.length>2){Interface.RegisterInterface.apply(cls,[cls].concat(Array.prototype.slice.call(arguments,2)))}}
_inline_object_aggregateInterfaceToConstractor:{var _ClassIntfs=Aggregate(cls,IJoPoints,IClass);var _ConstructorIntfs=Aggregate(cls.Create,IJoPoints,IObject,IAttrProvider,IAttributes);var intf=_ClassIntfs.GetInterface(IClass);var intf2=_ConstructorIntfs.GetInterface(IObject);var intf3=_ConstructorIntfs.GetInterface(IAttrProvider);intf2.hasEvent=function(n){return _r_event.test(n)&&(n in this)};intf2.hasProperty=function(n){return n in this};intf2.hasOwnProperty=function(n){return this.hasOwnProperty.apply(this,arguments)};intf.hasAttribute=intf2.hasAttribute=intf3.hasAttribute=function(n,t){var _proto_=getAttrPrototype(cls);return(n in _proto_?eval($cc_attr[t]):false);}
intf.hasOwnAttribute=intf2.hasOwnAttribute=intf3.hasOwnAttribute=function(n,t){var _proto_=getAttrPrototype(cls);return(_proto_.hasOwnProperty(n)?eval($cc_attr[t]):false);}
var intf=_ClassIntfs.GetInterface(IJoPoints);var intf=_ConstructorIntfs.GetInterface(IJoPoints);}
cls(Constructor);cls.OnClassInitialized(InstanceDataBlock);_inline_object_aggregateInterfaceAfterClassRegistered:{var intf4=_ConstructorIntfs.GetInterface(IAttributes);void function(){var length=0,all={},_proto_=getAttrPrototype(cls);for(n in _proto_){if(_proto_[n]instanceof Function)continue;all[length++]=all[n]={name:n,tags:eval($cc_attr['*'])?'rw':(eval($cc_attr['r'])?'r':(eval($cc_attr['w'])?'w':''))}}
intf4.getLength=function(){return length}
intf4.items=function(i){if(!isNaN(i))return all[i]}
intf4.names=function(n){if(all.hasOwnProperty(n))return all[n]}}();}
cls.Create.toString=function(){return Constructor.toString()};cls.Create.prototype.constructor=cls.Create;cls.Create.prototype.ClassInfo=cls;eval(Name+'= cls.Create');return cls;}
_inline_object_aggregateInterfaceToClassRegister:{var _ClassRegisterIntfs=Aggregate(_Class,IJoPoints,IClassRegister);var intf=_ClassRegisterIntfs.GetInterface(IJoPoints);intf.getLength=function(){return _joinpoints_.length}
intf.items=function(i){return _joinpoints_.items(i)}
intf.names=function(n){if(!isNaN(n))return _joinpoints_[n]}
var intf=_ClassRegisterIntfs.GetInterface(IClassRegister);intf.hasClass=function(n){return!!(n.indexOf('.')>-1?eval(n):_classinfo_[n])}}
return _Class;}();void function(){var _RTLOBJECT=new Object();Object=function(){}
Object.prototype=new _RTLOBJECT.constructor();}();TObject=Class('Object');_get=function(n){return _get.caller.caller.get(n)}
_set=function(n,v){return _set.caller.caller.set(n,v)}
_cls=function(){return _cls.caller.caller}
var
EPointCutAnalyzerNoPass=[8181,'PointCut Analyzer No Pass.'];TOnAspectBehavior=function(observable,aspectname,pointcut,args){};TOnAspectAfter=function(observable,aspectname,pointcut,args,value){};function Aspect(){var GetHandle={};Attribute(this,'AspectHost',null,'rw');Attribute(this,'AspectName',null,'rw');Attribute(this,'AspectType',null,'r');Attribute(this,'PointCut','','rw');Attribute(this,'MetaData',null,'rw');Attribute(this,'PointCutAnalyzer',NullFunction,'r');function $Aspect(pointcut,foo){var _aspect=this;var point=pointcut;var host=_aspect.get('AspectHost');var name=_aspect.get('AspectName');var f=foo;return function($A){if($A===GetHandle)return f;var _value,_intro=_cancel=_aspect.OnIntroduction(this,name,point,arguments)!==false;if(_intro)_aspect.OnBefore(this,name,point,arguments);if(_intro)_cancel=_aspect.OnAround(this,name,point,arguments)===false;if(!_cancel)_value=f.apply(this,arguments);if(_intro)_aspect.OnAfter(this,name,point,arguments,_value);return _value;}}
this.supported=Abstract;this.assign=function(host,name,pointcut){this.set('AspectHost',host);this.set('AspectName',name);this.set('PointCut',pointcut);this.set('MetaData',Array.prototype.slice.call(arguments,3));if(!(this.get('PointCutAnalyzer').call(this,pointcut))){throw new Error(EPointCutAnalyzerNoPass);}
var n,instance=this.get('AspectHost');switch(pointcut){case'AttrGetter':n='get';break;case'AttrSetter':n='set';break;default:n=this.get('AspectName');}
if(pointcut=='AttrGetter'||pointcut=='AttrSetter'){var f=instance[n];var adpa=$Aspect.call(this,pointcut,f);var attr=this.get('AspectName');instance[n]=function(n){return((arguments.length>0&&n==attr)?adpa:f).apply(this,arguments);}}
else if(pointcut=='Function'){var f=$Aspect.call(this,pointcut,host);eval(['if (host===',n,') ',n,'=f'].join(''));}
else{instance[n]=$Aspect.call(this,pointcut,instance[n]);}}
this.unassign=function(){var instance=this.get('AspectHost');if(!instance)return;var n,pointcut=this.get('PointCut');switch(pointcut){case'AttrGetter':n='get';break;case'AttrSetter':n='set';break;default:n=this.get('AspectName');}
if(!n)return;if(pointcut=='Function'){eval([n,'=',n,'(GetHandle);'].join(''));if(eval(n)!==instance)throw new Error();}
else if(instance[n]instanceof Function){instance[n]=instance[n](GetHandle);}
this.set('AspectHost',null)}
var $Aspects=['OnIntroduction','OnBefore','OnAfter','OnAround'];this.merge=function(){if(arguments.length==0)return;var args=arguments,argn=args.length;var f=function(e){this[e]=new MuEvent(this[e]);for(var i=0;i<argn;i++)this[e].add(args[i][e]);}
for(var i=0;i<$Aspects.length;i++){f.call(this,$Aspects[i]);}}
this.combine=function(){if(arguments.length==0)return;var args=arguments,argn=args.length;var f=function(e){this[e]=new MuEvent(this[e]);for(var i=0;i<argn;i++){this[e].add(args[i][e]);args[i][e]=this[e];}}
for(var i=0;i<$Aspects.length;i++){f.call(this,$Aspects[i]);}}
this.unmerge=function(){return this.uncombine();}
this.OnIntroduction=TOnAspectBehavior;this.OnBefore=TOnAspectBehavior;this.OnAfter=TOnAspectAfter;this.OnAround=TOnAspectBehavior;this.Create=function(){var _self={OnIntroduction:this.OnIntroduction,OnBefore:this.OnBefore,OnAfter:this.OnAfter,OnAround:this.OnAround}
this.uncombine=function(){this.OnIntroduction=_self.OnIntroduction;this.OnBefore=_self.OnBefore;this.OnAfter=_self.OnAfter;this.OnAround=_self.OnAround;}
if(arguments.length>0)this.assign.apply(this,arguments);}}
function FunctionAspect(){_set('AspectType','Function');_set('PointCutAnalyzer',function(pointcut){return(this.supported(pointcut)&&!!this.get('AspectHost'));});this.supported=function(pointcut){return(pointcut in{'Function':null})}}
function ClassAspect(){Attribute(this,'HostClass',null,'rw');_set('AspectType','Class');_set('PointCutAnalyzer',function(pointcut){return(this.supported(pointcut)&&(this.get('AspectName')in this.get('AspectHost')));});this.supported=function(pointcut){return(pointcut in{'Method':null})}
this.assign=function(host,name,pointcut){this.set('HostClass',host);arguments[0]=(host['ClassInfo']?host.Create:host.constructor).prototype;this.inherited();}}
function ObjectAspect(){Attribute(this,'HostInstance',null,'rw');_set('AspectType','Object');_set('PointCutAnalyzer',function(pointcut){var obj=this.get('HostInstance');if(this.supported(pointcut)){var n=this.get('AspectName');switch(pointcut){case'AttrGetter':case'AttrSetter':return((obj instanceof TObject.Create)&&Interface.QueryInterface(obj,IObject).hasAttribute(n));case'Event':if(!_r_event.test(n))return false;case'Method':return((n in obj)&&(obj[n]instanceof Function));}}});this.supported=function(pointcut){return(pointcut in{AttrGetter:null,AttrSetter:null,Method:null,Event:null})}
this.assign=function(host,name,pointcut){this.set('HostInstance',host);this.inherited();}}
function CustomAspect(){_set('AspectType','Custom');this.setAspectHost=function(v){var pts=Interface.QueryInterface(v,IJoPoints);if(!pts)throw new Error();this.unassign();this.set(v);}
this.supported=function(pointcut){var pts,host=this.get('AspectHost');return(host&&(pts=Interface.QueryInterface(host,IJoPoints))&&pts.items(pointcut));}
this.assign=function(host,name,pointcut){this.set('AspectHost',host);this.set('AspectName',name);this.set('PointCut',pointcut);this.set('MetaData',Array.prototype.slice.call(arguments,3));if(this.supported(pointcut)){var pts=Interface.QueryInterface(this.get('AspectHost'),IJoPoints);var pt=pts.items(pointcut);pt.assign(name,this);}}
this.unassign=function(){var host=this.get('AspectHost');if(host){var pts=Interface.QueryInterface(host,IJoPoints);var pt=pts.items(this.get('PointCut'));pt.unassign(this.get('AspectName'));}}}
TAspect=Class(TObject,'Aspect',IAspect);TFunctionAspect=Class(TAspect,'FunctionAspect');TClassAspect=Class(TAspect,'ClassAspect');TObjectAspect=Class(TAspect,'ObjectAspect');TCustomAspect=Class(TAspect,'CustomAspect');$import.OnSysInitialized();