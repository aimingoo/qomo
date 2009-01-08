/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2007.01.30]

 - some util functions for object
*****************************************************************************/

/**
 * TWeek = Enum('','','')
 */
Enum = function() {
  function _Enum(args) { }

  _Enum.prototype.indexOf = function (name) {
    return Array.prototype.indexOf.call(this.valueOf(), name);
  }

  return function(){
    var args=arguments, i=args.length, e=new _Enum(args);
    e.low = 0;
    e.high = i-1;
    while (i--) e[args[i]] = i;

    e.valueOf = function(ord) {
      return (ord==undefined ? args : args[ord])
    }
    return e;
  }
}();


/**
 * dict1 = new Dict();
 * dict2 = new Dict(
 *   'name1', 1,
 *   'name2', 2
 * );
 */
Dict = function() {
  function _Dict() {
    for (var i=0, args=arguments, argn=args.length; i<argn; i++) {
      this[args[i]] = args[++i];
    }
  }

  inDict = _Dict.inDict = function(dict, name) {
    return ({}).hasOwnProperty.call(dict, name);
  }

  getItem = _Dict.getItem = function(dict, name) {
    return _Dict.inDict(dict, name) ? dict[name] : undefined;
  }

  return _Dict;
}();


/**
 * batch attributes or properties of object.
 */
function getAttributes(obj, filter) {
  $debug('getAttributes() failed.');
}

function setAttributes(obj, v) {
  for (var i in v) obj.set(i, v[i]);
}

function getProperties(obj, filter) {
  var n, v={},i=0;
  if (filter instanceof RegExp) {
    for (n in obj) {if (filter.test(n)) v['_$Qo$'+n]=obj[n]};
  }
  else {
    while (n=filter[i++]) v['_$Qo$'+n]=obj[n];
  }
  return v;
}

function setProperties(obj, v) {
  for (var i in v) {
    if (i.lastIndexOf('_$Qo$',0) < 0) continue;
    obj[i.substr(5)] = v[i];
  }
}

function initEvents(obj, arr) {
  var n, e, i=0;
  while (n = arr[i++]) {
    e = obj[n];
    obj[n] = new MuEvent();
    if (e) obj[n].add(e);
  }
}

/**
 * HTML Event Extent.
 *  - initHtmlEvents()
 *  - attachEvents()
 */
HtmlEventProvider = function (obj){
  var e=new MuEvent();
  e.owner = obj;
  e.add = HtmlEventProvider.add;
  return e;
}
HtmlEventProvider.add = function(foo) {
  this.addMethod(this.owner, foo);
}

function initHtmlEvents(obj, arr) {
  var n, e, i=0;
  while (n=arr[i++]) {
    e = obj[n];
    obj[n] = HtmlEventProvider(obj);
    if (e) obj[n].add(e);
  }
}

function resetHtmlEvents(obj, arr) {
  var n, e, i=0;
  while (n=arr[i++]) {
    e = obj[n];
    obj[n] = HtmlEventProvider(obj);
    if (e) obj[n].add(e);
  }
}

function attachEvents(events, v) {
  var e, i;
  for (i in v) {
    if (i.lastIndexOf('_$Qo$',0) < 0) continue;
    if (v[i] && (e=events[i])) e.add(v[i]);
  }
}

function hookHtmlEvents(el, events) {
  initHtmlEvents(this, events);

  var hooked = getProperties(el, events);
  var v = getProperties(this, events);
  attachEvents(v, hooked);
  setProperties(el, v);
}

/**
 * virtual object instance.
 *   - fast make instance, you can mirror qomo's object use it.
 */
_ObjectInstance = function(){};
_ObjectInstance.prototype = {
  constructor: _ObjectInstance,
  data: {},
  set: function(n, v){this.data[n] = v},
  get: function(n) {return this.data[n]}
}
Interface.RegisterInterface(_ObjectInstance, IAttributer, IAttrProvider);
Delegate(_ObjectInstance, [
  [function(obj) {
    return {
      hasAttribute: function(n) { return n in obj.data },
      hasOwnAttribute: function(n) { return n in obj.data.hasOwnProperty(n) }
    }
  }, ['*IAttrProvider']]
]);