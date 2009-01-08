/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.25]

 - extend and enhance base object system
 - implement MuEvent() Object, support multe case event
*****************************************************************************/

/**
 * tag/const/keyword for global
 */
NullFunction = Hidden = function() {};
CustomArguments = function() { this.result = Array.prototype.slice.call(arguments, 0) };
BreakEventCast = function(v) { this.result = v };

/**
 * other - you can use JSEnhance.js without Qomo Framework
 */
void function() {
  if (typeof($assert) != 'function') $assert = NullFunction;
  if (typeof($QomoCoreFunction) != 'function') $QomoCoreFunction = function(n) { return NullFunction };
  if (typeof($Abstract) != 'function') Abstract = function() { throw new Error('Call Abstract Method.') }
}();

/**
 * base object system extend - Array
 */
Array.prototype.remove = function (i,n) {
  if (arguments.length==1) {
    if ((i=this.indexOf(i)) == -1) return null;
    n = 1;
  }
  return this.splice(i,n);
}

Array.prototype.clear = function() {
  if (this.length > 0) this.splice(0, this.length);
}

/**
 * sample:
 *  arr = [0,1,2,3,4], arr2=[2.5, 2.6];
 *  arr.insert(3, [2.7, 2.8, 2.9]);
 *  arr.insert(3, arr2);
 *  arr.insert(3, 2.1, 2.2, 2.3, 2.4);
 */
Array.prototype.insert = function (i,v) {
  if (arguments.length>2) {
    this.splice.call(arguments, 1, 0, 0);
    this.splice.apply(this, arguments);
  }
  else if (v instanceof Array) {
    v.unshift(i,0);
    this.splice.apply(this, v);
    v.splice(0,2);
  }
  else {
    this.splice(i,0,v)
  }
}

Array.prototype.add = function(item) {
  this.push(item);
}

Array.prototype.addRange = function(items) {
  this.push.apply(this, items)
}

Array.prototype.contains = function(item) {
  var index = this.indexOf(item);
  return (index >= 0);
}

/**
 * base object system extend - String
 */
void function(p) {
  var _r_strfmt = /%(\D|\d+)/g;

  function format(s, arr) {
    var i=0, n=arr.length;
    return (!n ? s : s.replace(_r_strfmt, function ($0,$1) {
      switch ($1) {
      case 's':
      case 'S': return (i==n ? $0 : arr[i++]);
      case '%': return $1;
      default : return (isNaN($1) ? $0 : arr[$1]);
      }
    }));
  }

  p.format = function() {
    return format(this, arguments);
  }
  String.format = format;

  p.etor = function(f) {
    return (!f || this.indexOf('${') < 0) ? this : this.replace(/\$\{(.*?)\}/g, f);
  }

  // is a array, [0..n-2] is begin_regexp, [n-1] is end_regexp;
  var _removeBlock = function(rgArray, setNewStr, lastIndex) {
    lastIndex = lastIndex || 0;

    for (var rBegin, v1, i=0, imax=rgArray.length-1; i<imax; i++) {
      rBegin = rgArray[i];
      rBegin.lastIndex = lastIndex;

      if ((v1 = rBegin.exec(this)) && (v1.index >= 0)) {
        var v2, rEnd = rgArray[imax];
        rEnd.lastIndex = rBegin.lastIndex;
        if (!(v2 = rEnd.exec(this)) || v2.index < 0) break;
        return this.substr(0, v1.index) + setNewStr + this.substr(rEnd.lastIndex);
      }
    }

    return this;
  }

  p.replaceBlock = _removeBlock;

  p.endsWith = function(suffix) {
    return (this.substr(this.length - suffix.length) == suffix);
  }
  p.startsWith = function(prefix) {
    return (this.substr(0, prefix.length) == prefix);
  }
  p.trimLeft = function() {
    return this.replace(/^\s*/, "");
  }
  p.trimRight = function() {
    return this.replace(/\s*$/, "");
  }
  p.trim = function() {
    return this.trimRight().trimLeft();
  }
}(String.prototype);
format = String.format;


/**
 * base object system extend - Number
 */
Number.prototype.toString = function(foo) {
  return function(radix, length) {
    var result = foo.apply(this, arguments).toUpperCase();
    var length = length || 0;
    return (result.length>=length ? result
      : (new Array(length - result.length)).concat(result).join('0')
    );
  }
}(Number.prototype.toString);

/**
 * base object system extend - Function
 */
Function.prototype.toString = function(foo){
  // get name and params from Function's toString()
  var _r_function = /^function\b *([$\w\u00FF-\uFFFF]*) *\(/;

  // always anonymous function string
  return function (natively) {
    return natively ? foo.call(this) : foo.call(this).replace(_r_function, 'function (');
  }
}(Function.prototype.toString);


/**
 * base object system extend - Error
 */
Error = function(Err) {
  return function(v1, v2) {
    return (!(v1 && v1.constructor===Array) ? new Err(v1, v2)
      : new Err(v1[0], String.format(v1[1], v1.slice(2)), v2));
  }
}(Error);


/**
 * mutil cast event
 */
MuEvent = function() {
  var hidden = $QomoCoreFunction('MuEvent');
  var funcs = ['add', 'addMethod', 'clear', 'close'];
  var GetHandle = {};

  var all = {
    length : 0,
    search : function(ME) {
      var i = ME(GetHandle), me = all[i];
      if (me && me.event==ME) return me;
    }
  }

  function add(foo) {
    this.addMethod(undefined, foo);
  }

  function addMethod(obj, foo) {
    var e = all.search(this);
    if (e) e.push(obj, foo);
  }

  function clear() {
    var e = all.search(this);
    if (e) while (e.length>0) delete e[--e.length];
  }
/* removed
  function reset(foo) {
    this.clear();
    this.add(foo);
  }
*/
  function close() {
    var e = all.search(this);
    if (e) {
      for (var i=0; i<funcs.length; i++) delete this[funcs[i]];
      delete e.event;
    }
  }

  function run(handle, args) {
    for (var v, v2, i=0, e=all[handle], len=e.length; i<len ; i++) {
      if ((v2 = e[i].apply((e[++i] || this), args)) !== undefined) {
        if (v2 instanceof BreakEventCast) {
          if (v2.result !== undefined) v = v2.result;
          break;
        }
        v = v2;
      }
    }
    //last valid result, or undefined.
    return v;
  }

  function _MuEvent() {
    // get a handle and init MuEvent Object
    var handle = all.length++;
    var ME = function($E) {
      if ($E==GetHandle) return handle;
      if (all[handle].length > 0) return run.call(this, handle, arguments)
    }
    ME.constructor = _MuEvent;
    ME.toString = hidden;
    all[handle] = this;

    // "this" is the new obj instance
    this.event = ME;

    var f, i=0, imax=arguments.length;
    while (f = funcs[i++]) ME[f] = eval(f);       // public MuEvent Methods
    for (i=0; i<imax; i++) ME.add(arguments[i]);  // init event cast list

    return ME;
  }

  // hide implement for funcs[]
  for (var f, i=0; i<funcs.length; i++) {
    eval(f=funcs[i]).toString = $QomoCoreFunction('MuEvent.' + f);
  }

  _MuEvent.toString = hidden;
  _MuEvent.prototype.length = 0;
  _MuEvent.prototype.push = function(obj, foo) {
    this[this.length++] = foo;
    this[this.length++] = obj;
  }
  return _MuEvent;
}();