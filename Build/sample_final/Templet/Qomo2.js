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
function Templet(){Attribute(this,'TempletContext','');var _r_templet=/\%(.*?)\%/gi;var _toString=function(src){var _src=(!src?this:src);var i=Interface.QueryInterface(_src,IAttrProvider);var v={'TempletContext':'%TempletContext%'};return this.get('TempletContext').replace(_r_templet,function($0,$1){return($1==''?'%':(v.hasOwnProperty($1)?v[$1]:(v[$1]=i.hasAttribute($1,'r')?_src.get($1):$0)));});}
this.toString=_toString;this.Create=function(src){if(src&&Interface.QueryInterface(src,IAttrProvider)){var _src=src;this.toString=function(){return _toString.call(this,_src)}}}}
TTemplet=Class(TObject,'Templet');var
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
TAspect=Class(TObject,'Aspect',IAspect);TFunctionAspect=Class(TAspect,'FunctionAspect');TClassAspect=Class(TAspect,'ClassAspect');TObjectAspect=Class(TAspect,'ObjectAspect');TCustomAspect=Class(TAspect,'CustomAspect');function createUniqueID(){return'_'+new Date().valueOf()+Math.random();}
function createUniqueVar(){var name=createUniqueID().replace('.','_');window.execScript(name+'=void null;','JavaScript');return name;}
function isVariant(){try{eval(arguments[0]);return true;}
catch(e){return false;}}
function defined(v){return v!==void null;}
ITimer=function(){this.start=Abstract;this.OnTimer=Abstract;this.stop=Abstract;}
function BaseTimer(){Attribute(this,'TimerID',NaN,'rw');Attribute(this,'TimerData',null,'rw');this.OnStart=NullFunction;this.OnTimer=NullFunction;this.OnStop=NullFunction;this.start=function(){this.OnStart();}
this.stop=function(){var id=this.get('TimerID');if(!isNaN(id)){clearInterval(id);clearTimeout(id);this.set('TimerID',NaN);}
this.OnStop();}
this.Create=function(){for(var i=0,args=arguments,argn=args.length;i<argn;i++){if(args[i]instanceof Function){this.OnTimer.add(args[i]);}
else{this.OnTimer.addMethod(args[i],args[++i]);}}}}
function Timer(){this.start=function(type,ms){var step=0,vCode=new MuEvent();vCode.addMethod(this,function(){this.OnTimer(step++);});this.inherited();this.set('TimerID',window['set'+type](vCode,ms));}}
TBaseTimer=Class(TObject,'BaseTimer');TTimer=Class(TBaseTimer,'Timer',ITimer);ITimeMachine=function(){this.start=Abstract;this.OnTimer=Abstract;this.stop=Abstract;}
function TimeMachine(){function _Provider(step,last){return this.get('Data')[step];}
function _Factory(aClass,aObj){if(aObj instanceof Steper)return aObj;if(aObj instanceof Array){var instance=aClass.Create();instance.set('Data',aObj);instance.OnStep.add(_Provider);return instance;}
else{$assert((typeof aObj=='number')||(aObj instanceof Number),'param invaild for TTimeMachine.start().');var instance=aClass.Create();instance.set('Data',aObj);instance.OnStep.add(new Function('return '+Number(aObj).toString()));return instance;}}
this.start=function(data,time){var sequ=_Factory(TLineSteper,data);var line=_Factory(TSequenceSteper,time);var ms,step,last=undefined;var vCode=new MuEvent();vCode.addMethod(this,function(){last=sequ.OnStep(step,last);if(last===undefined)return void this.stop();this.OnTimer(step,last);ms=line.OnStep(++step,ms);if(ms<1)return void this.stop();this.set('TimerID',window.setTimeout(vCode,ms));});this.inherited();this.set('TimerID',window.setTimeout(vCode,ms=line.OnStep(step=0,0)));}}
TTimeMachine=Class(TBaseTimer,'TimeMachine',ITimeMachine);function StepTrigger(){this.easeNone=function(t,b,c,d){return b+c*(t/=d);};this.easeIn=function(t,b,c,d){return b+c*((t/=d)*t*t);};this.easeOut=function(t,b,c,d){var ts=(t/=d)*t;var tc=ts*t;return b+c*(tc+-3*ts+3*t);};this.easeBoth=function(t,b,c,d){var ts=(t/=d)*t;var tc=ts*t;return b+c*(-2*tc+3*ts);};this.backIn=function(t,b,c,d){var ts=(t/=d)*t;var tc=ts*t;return b+c*(-3.4005*tc*ts+10.2*ts*ts+-6.2*tc+0.4*ts);};this.backOut=function(t,b,c,d){var ts=(t/=d)*t;var tc=ts*t;return b+c*(8.292*tc*ts+-21.88*ts*ts+22.08*tc+-12.69*ts+5.1975*t);};this.backBoth=function(t,b,c,d){var ts=(t/=d)*t;var tc=ts*t;return b+c*(0.402*tc*ts+-2.1525*ts*ts+-3.2*tc+8*ts+-2.05*t);}
this.bezierPosition=function(points,t){var n=points.length;var tmp=[];for(var i=0;i<n;++i){tmp[i]=[points[i][0],points[i][1]];}
for(var j=1;j<n;++j){for(i=0;i<n-j;++i){tmp[i][0]=(1-t)*tmp[i][0]+t*tmp[parseInt(i+1,10)][0];tmp[i][1]=(1-t)*tmp[i][1]+t*tmp[parseInt(i+1,10)][1];}}
return[tmp[0][0],tmp[0][1]];}}
TStepTrigger=Class(TObject,'StepTrigger');TOnStep=function(nStep,nLast){}
function Steper(){Attribute(this,'Data',null,'rw');this.OnStep=TOnStep;}
TSteper=Class(TObject,'Steper');TLineSteper=TSteper;TSequenceSteper=TSteper;function YuiSteper(){Attribute(this,'Easing','easeOut');Attribute(this,'Points',null);Attribute(this,'Frames',100);Attribute(this,'Fps',200);Attribute(this,'From',0);Attribute(this,'To',100);var trig=TStepTrigger.Create();var doStep=function(step,data){var method=trig[this.get('Easing')];var frames=this.get('Frames');if(method&&step<=frames){var from=this.get('From');var count=this.get('To')-from;var pts,val=method(step,from,count,frames);if(pts=this.get('Points')){val=trig.bezierPosition(pts,val/count);}
return val;}}
this.Create=function(){this.OnStep.add(doStep);}}
TYuiSteper=Class(TSteper,'YuiSteper');function Timeline(){function _Interval(ms){var step=TSteper.Create();step.OnStep=new Function('return '+ms);return step;}
this.start=function(data,time){this.inherited('start',data,(isNaN(time)?time:_Interval(parseInt(time))));}}
TTimeline=Class(TTimeMachine,'Timeline');function _Enum(args){this.toLocaleString=args;}
_Enum.prototype.valueOf=function(v){return this.toLocaleString[v];}
_Enum.prototype.nameOf=function(v){return this.toLocaleString[v];}
_Enum.prototype.indexOf=function(v){for(var args=this.toLocaleString,i=0;i<args.length;i++)
if(args[i]==v)return i;return-1;}
function Enum(){var i=0,args=arguments,l=args.length,obj=new _Enum(args);while(i<l)obj[args[i]]=i++;obj.low=function(){return 0};eval('obj.high = function () {return '+(l-1)+'};');return obj;}
function getAttributes(obj,filter){$debug('getAttributes() failed.');}
function getProperties(obj,filter){var n,v={},i=0;if('test'in filter){for(n in obj){if(filter.test(n))v[n]=obj[n]};}
else{while(n=filter[i++])v[n]=obj[n];}
return v;}
function setAttributes(obj,v){for(var i in v)obj.set(i,v[i]);}
function setProperties(obj,v){for(var i in v)obj[i]=v[i];}
function initEvents(obj,arr){var n,e,i=0;while(n=arr[i++]){e=obj[n];obj[n]=new MuEvent();if(e)obj[n].add(e);}}
HtmlEventProvider=function(obj){var e=new MuEvent();e.owner=obj;e.add=HtmlEventProvider.add;return e;}
HtmlEventProvider.add=function(foo){this.addMethod(this.owner,foo);}
function initHtmlEvents(obj,arr){var n,e,i=0;while(n=arr[i++]){e=obj[n];obj[n]=HtmlEventProvider(obj);if(e)obj[n].add(e);}}
function resetHtmlEvents(obj,arr){var n,e,i=0;while(n=arr[i++]){e=obj[n];obj[n]=HtmlEventProvider(obj);if(e)obj[n].add(e);}}
function attachEvents(events,v){var e,i;for(i in v){if(v[i]&&(e=events[i]))e.add(v[i]);}}
function hookHtmlEvents(el,events){initHtmlEvents(this,events);var hooked=getProperties(el,events);var v=getProperties(this,events);attachEvents(v,hooked);setProperties(el,v);}
_ObjectInstance=function(){};_ObjectInstance.prototype={data:{},set:function(n,v){this.data[n]=v},get:function(n){return this.data[n]}}
function toDec(hex){return parseInt(hex,16);}
function toHex(dec){return(dec>255?'FF':dec.toString(16,2));}
function longHexToDec(hex){return[toDec(hex.substring(0,2)),toDec(hex.substring(2,4)),toDec(hex.substring(4,6))];}
var
TMachineStateChange=function(state){};function Pool(){Attribute(this,'Size',0,'rw');Attribute(this,'FIFO',true,'rw');Attribute(this,'DataPool',null,'rw');Attribute(this,'BusyMachine',null,'rw');Attribute(this,'MachineQueue',null,'rw');Attribute(this,'MachineClass',null,'rw');this.OnStateChange=function(mac,state){}
var Hook_MachineStateChange=function(state){if(state=='resume')return;var mac=this,pool=mac.pool;pool.OnStateChange(mac,state);if(state=='sleep')
release.call(pool,mac);else if(state=='free')
pool.get('BusyMachine').remove(mac);}
var release=function(mac){if(mac.data=(this.get('FIFO')?this.get('DataPool').shift():this.get('DataPool').pop())){this.OnStateChange(mac,'resume');mac.OnStateChange('resume');}
else{mac.data=mac.pool=null;this.get('BusyMachine').remove(mac);this.get('MachineQueue').push(mac);}}
var require=function(){with(this.get('MachineQueue')){if(length>0)return pop();}
if(this.get('BusyMachine').length<this.get('Size')){var cls=this.get('MachineClass');var mac=callAgain(cls,cls.Create);mac.OnStateChange.add(Hook_MachineStateChange);return mac;}}
this.push=function(data){var mac=require.call(this);if(!mac)
this.get('DataPool').push(data);else{this.get('BusyMachine').push(mac);mac.pool=this;mac.data=data;mac.pool.OnStateChange(mac,'resume');mac.OnStateChange('resume');}}
this.Create=function(cls,size){this.set('MachineClass',cls);this.set('MachineQueue',new Array());this.set('BusyMachine',new Array());this.set('DataPool',new Array());this.set('Size',isNaN(size)?0:+size);}}
TPool=Class(TObject,'Pool');function HttpGetMachine(){Attribute(this,'XMLHTTP',null,'rw');Attribute(this,'METHOD','GET','r');this.OnStateChange=TMachineStateChange;var doStateChange=function(state){if(state=='resume'){var xmlHttp=this.get('XMLHTTP');var method=this.get('METHOD');var data=null,src=this.data.src;if(method=='GET'){xmlHttp.open(method,src,true);}
else{data=src.substr(src.indexOf('?')+1);src=src.substr(0,src.length-data.length-1);data=unescape(data);xmlHttp.open(method,src,true);xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');xmlHttp.setRequestHeader('Content-Length',data.length);}
xmlHttp.send(data);}
else if(state=='free'){this.set('XMLHTTP',null);}}
var onreadystatechange=function(){var xmlHttp=this.get('XMLHTTP');this.OnStateChange(xmlHttp.readyState);if(xmlHttp.readyState==4){this.OnStateChange('sleep');}}
this.Create=function(){this.data=null;this.pool=null;this.OnStateChange.add(doStateChange);this.set('XMLHTTP',new Ajax());var mac=this;this.get('XMLHTTP').onreadystatechange=function(){onreadystatechange.call(mac)}}}
THttpGetMachine=Class(TObject,'HttpGetMachine');GLOBAL={lastCursor:null,lastX:0,lastY:0,X:0,Y:0,event:{},draging:null,zooming:null,zManager:{},selector:null}
GLOBAL.zManager.add=function(el){var z=el.style.zIndex;if(z){if(this[z])this[z].push(el);else this[z]=[el];}}
GLOBAL.zManager.remove=function(el){var z=el.style.zIndex;if(z&&this[z])this[z].remove(el);}
_DOC=window.document;function genFilter(str){var i,f,fi=[],fo=[],ff=str.split(';'),len=ff.length;for(i=0;i<len;i++){if(ff[i].charAt(0)=='-')
fo.push((ff[i].substr(1)).split('='));else
fi.push(ff[i].split('='));}
return[fi,fo];}
function findElement(el,filter,all){if(typeof filter=='string')filter=genFilter(filter);var i,j,v,fi=filter[0],fo=filter[1],all=(all)?el.all:el.children,len=all.length;next:for(i=0;i<len;i++){v=all[i];for(j=0;j<fi.length;j++)if(v[fi[j][0]]!=fi[j][1])continue next;for(j=0;j<fo.length;j++)if(v[fo[j][0]]==fo[j][1])continue next;return v;}}
function isChildren(oEl,el){while(el=el.parentElement)
if(el===oEl)return true;return false;}
function inElements(oEls,el){var i,len=oEls.length;do{for(i=0;i<len;i++)if(el===oEls[i])return oEls[i];}while(el=el.parentElement);return null;}
function elementHeight(el){with(el.getBoundingClientRect())return bottom-top;}
function elementWidth(el){with(el.getBoundingClientRect())return right-left;}
function elementRect(el){var r=el.getBoundingClientRect();var w=r.right-r.left,h=r.bottom-r.top;r.left-=el.clientLeft;r.top-=el.clientTop;r.right=r.left+w;r.bottom=r.top+h;return r;}
function getGroupBound(all){var r={left:Number.MAX_VALUE,top:Number.MAX_VALUE,right:Number.MIN_VALUE,bottom:Number.MIN_VALUE};for(var el,i=0,len=all.length;i<len;i++){el=all[i];r.left=Math.min(r.left,el.style.pixelLeft);r.top=Math.min(r.top,el.style.pixelTop);r.right=Math.max(r.right,el.style.pixelLeft+el.style.pixelWidth);r.bottom=Math.max(r.bottom,el.style.pixelTop+el.style.pixelHeight);}
return r;}
function offsetBy(el,type){if(this===el)return 0;var v=999,owner=this,border='client'+type;type='offset'+type;do{v+=owner[type];}while((owner=owner.offsetParent)&&owner!==el&&(v+=owner[border]))
return v-999;}
function cancelEvent(){return(!(window.event.cancelBubble=true))}
function cancelEvent2(){return(window.event.cancelBubble=true)}
function getEventX(el){return window.event.offsetX+offsetBy.call(window.event.srcElement,el,'Left');}
function getEventY(el){return window.event.offsetY+offsetBy.call(window.event.srcElement,el,'Top');}
function coll2array(coll){if(coll){if('tagName'in coll)return[coll];for(var i=0,len=coll.length,arr=new Array(len);i<len;i++)arr[i]=coll[i];return arr;}
return null;}
function appendElement(el){switch(_DOC.readyState){case'uninitialized':$assert(flase,'hi, can\'t do anythings at document uninitialized');return;case'interactive':case'loading':_DOC.writeln(el.outerHTML);return _DOC.getElementById(el.id);default:_DOC.body.appendChild(el);return el;}}
function warpUpChild(el,warp){var to,node,isSib=false,owner=el.parentElement;if(node=el.nextSibling)
isSib=true;else
node=owner;owner.removeChild(el);warp.appendChild(el);if(isSib)
node.insertAdjacentElement('beforeBegin',warp);else
owner.appendChild(warp);}
var
EAssignTargetNoExist=[8301,'试图将控件assign()到一个不存在的目标(元素或对象)上.'];TOnAssigned=function(el){};function HtmlController(){var _DOM_Elem='_DOM_Element';Attribute(this,_DOM_Elem,null,'p');Attribute(this,'ImmediateBind',true,'r');this.hookEvents=function(){var args=arguments,events=((args.length==1)&&(args[0]instanceof Array))?args[0]:args;var DOM=this.get(_DOM_Elem);hookHtmlEvents.call(this,DOM,events);}
this.OnAssigned=TOnAssigned;this.assign=function(Id,byName,subIndex){var el=Id;if(typeof Id=='string'){if((arguments.length==2)&&byName)subIndex=0;el=(byName)?_DOC.getElementsByName(Id)[subIndex]:_DOC.getElementById(Id);}
this.set(_DOM_Elem,el);this.assignedElement=el;this.OnAssigned(el);}
var _AttrProviderReplace=function(){var $get=this.get;var $set=this.set;var $all=Interface.QueryInterface(this,IAttributes);this.get=function(n){if(arguments.length==0)return $get.call(this);var el,v;if(!$all.names(n)&&(el=$get.call(this,_DOM_Elem))){var v=el.getAttribute(n,1);if(v!==null)return v;if(n in el)return el[n];}
return $get.call(this,n);}
this.set=function(n,v){if(arguments.length==1)return $set.call(this,arguments[0]);switch($get.call(this,n)){case v:return;case undefined:{var el=$get.call(this,_DOM_Elem);if(n in el)return void(el[n]=v);if(el.getAttribute(n,1)!==null)return void(el.setAttribute(n,v));}
default:$set.call(this,n,v);}}}
this.Create=function(Id,byName,subIndex){_AttrProviderReplace.call(this);if(arguments.length>0)this.assign.apply(this,arguments);this.Create=this.assign;}}
void function(){var asp=new CustomAspect(Class,'THtmlController_SubClass_Init','Initialized')
asp.OnIntroduction.add(function(cls,n,p,a){do{if(cls.ClassName=='THtmlController')return}while(cls=cls.ClassParent);return false;});asp.OnBefore.add(function(cls,n,p,a){var Intfs=Aggregate(cls.Create,IAttrProvider);var intf=Intfs.GetInterface(IAttrProvider);var has=intf.hasAttribute;var hasOwn=intf.hasOwnAttribute;intf.hasAttribute=function(n,t){var t2=('rw*'.indexOf(t)>-1?0:parseInt(t));return(this.assignedElement.getAttribute(n,t2)!==null?true:has.apply(intf,arguments))}
intf.hasOwnAttribute=function(n,t){var t2=('rw*'.indexOf(t)>-1?0:parseInt(t));return(this.assignedElement.getAttribute(n,t2)!==null?true:hasOwn.apply(intf,arguments))}});}();THtmlController=Class(TObject,'HtmlController');__DOC=THtmlController.Create(window.document);function HtmlComponent(){var _CLS_Custom=['onmouseenter','onmouseleave','onmouseonwn','onmouseup','onkeyonwn','onkeyup'];var resetAttributes=function(el){var IAttr=Interface.QueryInterface(this,IAttributes);var all=[];for(var i=0,imax=IAttr.getLength();i<imax;i++){with(IAttr.items(i)){if(tags.indexOf('w')>-1)all.push(name);}}
for(var v,i=0;i<all.length;i++){if(!el['getAttribute']||(v=el.getAttribute(all[i],1))===null)continue;if(!isNaN(v))
this.set(all[i],parseInt(v));else switch(v.toLowerCase()){case'false':this.set(all[i],false);break;case'true':this.set(all[i],true);break;default:this.set(all[i],v);}}}
doAssigned=function(Id,byName,subIndex){el=this.assignedElement;resetAttributes.call(this,el);}
this.Create=function(){this.OnAssigned.add(doAssigned);this.inherited();}}
THtmlComponent=Class(THtmlController,'HtmlComponent');function HtmlTemplet(){Attribute(this,'TempletContext','<%tagName% id="%id%" class="%className%"%Attributes%></%tagName%>');Attribute(this,'tagName','','r');Attribute(this,'id','','rw');this.getAttributes=function(){var v=this.get();return(!v?'':' '+(v instanceof Array?v.join(' '):v.toString()));}
this.Create=function(ctrl){if(ctrl&&!(ctrl instanceof HtmlController))throw new Error();this.inherited();}}
function InlineTemplet(){_set('tagName','SPAN');}
function BlockTemplet(){_set('tagName','DIV');}
function TagTemplet(){_set('TempletContext','<%tagName% id="%id%" class="%className%"%Attributes% />');}
function ComponentTemplet(){this.getDefaultClassName=function(){return'Css'+this.ClassInfo.ClassName.replace(/^.*?_/,'');}
this.Create=function(id){if(id&&(typeof id=='string'||id instanceof String)){this.set('id',id);this.inherited('Create',new CustomArguments());}
else{this.inherited();}}}
THtmlTemplet=Class(TTemplet,'HtmlTemplet');TInlineTemplet=Class(THtmlTemplet,'InlineTemplet');TBlockTemplet=Class(THtmlTemplet,'BlockTemplet');TTagTemplet=Class(THtmlTemplet,'TagTemplet');TComponentTemplet=Class(TBlockTemplet,'ComponentTemplet');function BaseControl(){_set('ImmediateBind',false);this.assign=function(el){if(arguments.length==0){el=_DOC.createElement('DIV');el.id=this.id;el=appendElement(el);}
else{if(typeof el=='string')el=_DOC.getElementById(el);if(!el)throw new Error(EAssignTargetNoExist);}
this.name=el.name;this.id=el.id;this.inherited();}
this.toString=function(){return el.outerHTML;}}
TBaseControl=Class(THtmlController,'BaseControl');if(!document.all){$debug('sorry, Drag.js unit for IE only...','<BR>')}
else{initEvents(_DOC,['onmouseup','onmousemove','onmousedown','onmouseover','onmouseout']);_DOC.onmousedown.add(function(){GLOBAL.lastX=window.event.screenX;GLOBAL.lastY=window.event.screenY;});_DOC.onmouseup.add(function(){GLOBAL.draging=null;GLOBAL.zooming=null;if(GLOBAL.lastCursor!==null){_DOC.body.style.cursor=GLOBAL.lastCursor;GLOBAL.lastCursor=null;}});_DOC.onmousemove.add(function(){with(GLOBAL){var sor,el,i,e=window.event,x=e.screenX-lastX,y=e.screenY-lastY;if(el=draging){el.style.pixelLeft+=x;el.style.pixelTop+=y;}
if(zooming===null){if(GLOBAL.lastCursor!==null){_DOC.body.style.cursor=GLOBAL.lastCursor;GLOBAL.lastCursor=null;}}
else{if((sor=document.body.style.cursor)&&(el=zooming)){switch(sor){case'e-resize':el.style.pixelWidth+=x;break;case's-resize':el.style.pixelHeight+=y;break;case'nw-resize':el.style.pixelWidth+=x;el.style.pixelHeight+=y;break;}}}
lastX=window.event.screenX;lastY=window.event.screenY;}});}
function BasePanel(){Attribute(this,'CanDrop',false,'rw');Attribute(this,'CanResize',false,'rw');Attribute(this,'flatDrop',true,'rw');Attribute(this,'DropInOwner',false,'rw');Attribute(this,'ZoomRectCursor','','rw');this.setCanDrop=function(v){var css=this.get('style');if(v&&css.position!='absolute'){css.position='absolute';}
this.set(v);}
this.getMoving=function(){return(this.assignedElement===GLOBAL.draging)}
this.getResizing=function(){return(this.assignedElement===GLOBAL.zooming)}
var doMouseDown_Drag=function(){var el=this.assignedElement;if(el){if(this.get('ZoomRectCursor')&&(!this.get('Resizing'))){GLOBAL.zooming=el;}
else if(this.get('CanDrop')&&(!this.get('Moving'))){GLOBAL.draging=el;if((this.get('flatDrop')===true)&&(el.style.zIndex!=10002)){this.set('flatDrop',el.style.zIndex);el.style.zIndex=10002;GLOBAL.zManager.add(el);}}}
GLOBAL.lastX=window.event.screenX;GLOBAL.lastY=window.event.screenY;}
var doMouseUp_Drag=function(){var el=this.assignedElement;if(el.style.zIndex==10002){GLOBAL.zManager.remove(el);el.style.zIndex=this.get('flatDrop');this.set('flatDrop',true);}}
var doMouseMove_Drag=function(){if(!(this.assignedElement&&this.get('DropInOwner')))return;var src=this.assignedElement,style=src['style'],e=window.event;if(this.get('Moving')){if(style&&this.get('CanDrop')){var
x=style.pixelLeft+e.screenX-GLOBAL.lastX,y=style.pixelTop+e.screenY-GLOBAL.lastY,p=src.parentElement,r={l:x,t:y,w:style.pixelWidth,h:style.pixelHeight},cr={l:0,t:0,w:p.clientWidth,h:p.clientHeight};style.left=x;style.top=y;if(r.l<=cr.l)style.left=0;if(r.t<=cr.t)style.top=0;if(r.l+r.w>=cr.w)style.left=cr.w-r.w;if(r.t+r.h>=cr.h)style.top=cr.h-r.h;GLOBAL.lastX=e.screenX;GLOBAL.lastY=e.screenY;e.cancelBubble=true;}}}
var doAdjustZoomRectCursor=function(){if(!this.get('CanResize'))return;var e=window.event,el=this.assignedElement;if(!el||el!=e.srcElement)return;var
r=elementRect(el),x=e.screenX-_DOC.body.clientLeft,y=e.screenY-_DOC.body.clientTop,rbw=12,sor=(y>(r.bottom-rbw))?'s':'';if(x>(r.right-rbw))sor=(sor)?'nw':'e';if(GLOBAL.zooming===null&&GLOBAL.draging===null){this.set('ZoomRectCursor',sor);if(GLOBAL.lastCursor===null)GLOBAL.lastCursor=_DOC.body.style.cursor;_DOC.body.style.cursor=((sor!='')?sor+'-resize':'');e.cancelBubble=true;}}
this.assign=function(el){this.inherited();if(this.get('CanDrop'))this.set('CanDrop',true);this.hookEvents(['onmousedown','onmousemove','onmouseup']);this.onmousedown.add(doMouseDown_Drag);this.onmouseup.add(doMouseUp_Drag);this.onmousemove.add(doAdjustZoomRectCursor);this.onmousemove.add(doMouseMove_Drag);}
this.Create=function(){this.inherited();}}
TBasePanel=Class(TBaseControl,'BasePanel');var
TOnItemDraw=function(item){};function BaseList(){Attribute(this,'Count',0);var doDraw=function(){for(var i=0,items=this.items;i<items.length;i++)
this.OnItemDraw(items[i]);}
var doRedraw=function(){this.set('innerHTML','');this.draw();}
this.getCount=function(){return this.items.length;}
this.setCount=function(v){var i,items=this.items,item=['',''];for(i=items.length;i<v;i++)items.push(item);}
this.draw=doDraw;this.OnItemDraw=Abstract;this.Create=function(){this.inherited();this.redraw=doRedraw;this.items=[];}}
TBaseList=Class(TBaseControl,'BaseList');var
EAssignTargetTypeError=[8302,'试图将控件assign()到一个类型不正确的目标(元素)上.'];function TableList(){this.OnItemDraw=TOnItemDraw;var doItemDraw=function(item){var text=item[0],url=item[1];var tr=this.get('insertRow')();var td=tr.insertCell();if(text){if(typeof url!='function')
td.innerHTML=(!url)?text:text.link(url);else{var a=_DOC.createElement('A');a.href='#';a.innerHTML=text;a.onclick=url;td.appendChild(a);}}}
this.assign=function(el){if(!el){el=_DOC.createElement('TABLE');el.id=this.id;_DOC.appendChild(el);}
else{if(el.tagName!='TABLE')throw new Error(EAssignTargetTypeError);}
this.inherited();}
this.Create=function(){this.inherited();this.OnItemDraw.add(doItemDraw);}}
TTableList=Class(TBaseList,'TableList');var
TOnItemContextDraw=function(el,item){};function OutbarList(){this.OnItemDraw=TOnItemDraw;this.OnItemTitleDraw=this.OnItemBodyDraw=TOnItemContextDraw;Attribute(this,'BarHeight',20,'rw');Attribute(this,'ShowingCount',null);this.getShowingCount=function(){for(var c=len=this.get('Count'),i=0;i<len;i++)
if(this.findBartitleElement(i).style.display!='')c--;return c;}
var findElementByIdExt=function(el,IdExt,subIndex){return(isNaN(subIndex)?el.children(el.id+IdExt):el.children(el.id+IdExt,parseInt(subIndex)));}
var doItemTitleDraw=function(el,item){el.innerHTML='<img src="%s" border=0>%s'.format(item[1],item[0]);}
var doItemDraw=function(item){var text=item[0],icon=item[1];var title=_DOC.createElement('DIV');var body=_DOC.createElement('DIV');title.id=this.id+'_title';title.className='OutbarList_title';title.style.pixelHeight=this.get('BarHeight');body.id=this.id+'_body';body.className='OutbarList_body';body.style.overflowY='hidden';body.style.display='none';body.height=0;title.style.position=body.style.position='relative';this.assignedElement.appendChild(title);this.OnItemTitleDraw(title,item);this.assignedElement.appendChild(body);this.OnItemBodyDraw(body,item);if(body.innerHTML=='')
title.style.display='none';}
var doMouseDown=function(){if(this.currentIndex==-1)return;var
el=window.event.srcElement,assEl=this.assignedElement,titleId=assEl.id+'_title';var
isTitle=el.id==titleId,isBody=el.id==assEl.id+'_body';if(!isTitle&&!isBody)return;var oldEl=this.findBartitleElement(this.currentIndex);if(oldEl==el)return;var
idx=0,body1=oldEl.nextSibling,body2=el.nextSibling;while(el=el.previousSibling)if(el.id==titleId)idx++;var provide=TYuiSteper.Create();provide.set('From',body1.style.pixelHeight);provide.set('To',0);provide.set('Frames',10);var timer=TTimeline.Create(this,function(step,data){var last=body1.style.pixelHeight;body1.style.pixelHeight=data=parseInt(data);body2.style.pixelHeight+=last-data;body2.style.display='';if(data==0){body1.style.display='none';this.currentIndex=idx;timer.stop();}});this.currentIndex=-1;timer.start(provide,50);}
var getIndexByName=function(n){for(var i=0,imax=this.items.length;i<imax;i++)
if(this.items[i][0]==n)return i;}
this.findBartitleElement=function(i){if(typeof i=='string')i=getIndexByName.call(this,i);return findElementByIdExt(this.assignedElement,'_title',i);}
this.findBarbodyElement=function(i){if(typeof i=='string')i=getIndexByName.call(this,i);return findElementByIdExt(this.assignedElement,'_body',i);}
this.hidePage=function(i){if(typeof i=='string')i=getIndexByName.call(this,i);var title=this.findBarbodyElement(i),body=this.findBarbodyElement(i);title.style.display='none';body.style.display='none';}
this.isVisible=function(i){return this.findBartitleElement(i).style.display=='';}
this.draw=function(){this.inherited();var c=this.get('Count');var i=(this.currentIndex<0)?this.currentIndex=0:(this.currentIndex>=c)?this.currentIndex=c-1:this.currentIndex;if(!this.isVisible(i)){for(i=0;i<c;i++)if(this.isVisible(i))break;if(i!=c)
this.currentIndex=i;else{this.currentIndex==-1;return;}}
with(this.findBarbodyElement(i).style){pixelHeight=this.assignedElement.clientHeight-this.get('ShowingCount')*this.get('BarHeight');display='';}}
this.assign=function(el){this.inherited();this.hookEvents(['onmousedown']);this.onmousedown.add(doMouseDown);}
this.Create=function(){this.inherited();this.OnAssigned.add(function(el){this.currentIndex=0;this.OnItemDraw.add(doItemDraw);this.OnItemTitleDraw.add(doItemTitleDraw);});}}
TOutbarList=Class(TBaseList,'OutbarList');function getNodesIndex(arr,k){arr.sort(function(n1,n2){return n1[k]-n2[k];});if(arr.length==0)return;for(var i=0,v=arr[0][k],r=[0];i<arr.length;i++){if(arr[i][k]!=v)r.push(i);v=arr[i][k];}
r.push(arr.length);return r;}
function genNodesTopo(nodes,idx,kp,kn){var i,l,r,n,topo=new Array(idx.length-1);var sortTopo=function(n1,n2){return((n1[kp]>n2[kp])?1:(n1[kp]<n2[kp])?-1:((n1[kn]>n2[kn])?1:(n1[kn]<n2[kn])?-1:0))}
for(i=0;i<topo.length;i++){l=idx[i],r=idx[i+1];n=nodes.slice(l,r);n.sort(sortTopo);topo[i]=n;}
return topo;}
function genUnwindScale(n){var i,r=new Array(n);for(i=0;i<r.length;i++)r[i]=Math.pow(1.2,i);return r;}
function getPostion(i,imax,level,Scales){var Scale=Scales[level];return(i-imax/2)*Scale;}
function genPostion(nodes,level,Scales){for(var i=0,imax=nodes.length-1,r=new Array(nodes.length),Scale=Scales[level];i<=imax;i++)
r[i]=(i-imax/2)*Scale;return r;}
TopoLogic=function(){this.OnQueryLevelInfo=Abstract;this.OnDrawNode=Abstract;Attribute(this,'Topo',null,'rw');Attribute(this,'Levels');Attribute(this,'MiniCenterX',200,'rw');this.getLevels=function(){var topo=this.get('Topo');return((!topo)?-1:topo.length);}
this.calcScalesCenter=function(Scales,idx){for(var n,w,left=0,lv=0;lv<idx.length-1;lv++){w=this.queryW(lv);n=idx[lv+1]-idx[lv]-1;n=-n/2*Scales[lv];if(left>(n=(w+5)*n))left=n;}
var x=this.get('MiniCenterX');return((left>-x)?x:parseInt(-left));}
this.toString=function(){var topo=this.get('Topo');var str,lv,i,node,nodes,info={top:0,width:0,height:0};for(str='',lv=0;lv<topo.length;lv++){this.OnQueryLevelInfo(lv,info);nodes=topo[lv];for(i=0;i<nodes.length;i++){node=nodes[i];str+=this.OnDrawNode(lv,info,i,node);}}
return str;}
this.draw=function(){document.writeln(this);}
this.Create=function(nodes,Idx,kParent,kNode){if(arguments.length==0)return;this.set('Topo',genNodesTopo(nodes,Idx,kParent,kNode));this.xunit=this.yunit=this.queryW=this.queryH=this.centerX=null;}}
TTopoLogic=Class(TObject,'TopoLogic');