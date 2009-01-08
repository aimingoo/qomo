/********************************************************
Qomolangma OpenProject v1.0
 [v1.0 release 2007.01.31]
********************************************************/


$QomoCoreFunction=function(name){return new Function("return 'function "+name+"() {\\n    [qomo_core code]\\n}'");}
if(window.execScript==null){window.execScript=function(script,type){window.eval(script,type);}}
$debug=function(){};var
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
return _Aggregate;}();JoPoint=JoPoints=function(){this.add=this.items=this.names=this.getLength=this.assign=this.unassign=function(){};this.weaving=function(n,f){return f}}
NullFunction=Hidden=function(){};CustomArguments=function(){this.result=Array.prototype.slice.call(arguments,0)};BreakEventCast=function(v){this.result=v};EIsNotAspect=[8071,'JoPoint Connect to a non-Aspect object.'];void function(){if(typeof($assert)!='function')$assert=NullFunction;if(typeof($QomoCoreFunction)!='function')$QomoCoreFunction=function(n){return NullFunction};if(typeof($Abstract)!='function')Abstract=function(){throw new Error('Call Abstract Method.')}}();Array.prototype.remove=function(i,n){if(arguments.length==1){if((i=this.indexOf(i))==-1)return null;n=1;}
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
function Templet(){Attribute(this,'TempletContext','');var _r_templet=/\%(.*?)\%/gi;var _toString=function(src){var _src=(!src?this:src);var i=Interface.QueryInterface(_src,IAttrProvider);var v={'TempletContext':'%TempletContext%'};return this.get('TempletContext').replace(_r_templet,function($0,$1){return($1==''?'%':(v.hasOwnProperty($1)?v[$1]:(v[$1]=i.hasAttribute($1,'r')?_src.get($1):$0)));});}
this.toString=_toString;this.Create=function(src){if(src&&Interface.QueryInterface(src,IAttrProvider)){var _src=src;this.toString=function(){return _toString.call(this,_src)}}}}
TTemplet=Class(TObject,'Templet');