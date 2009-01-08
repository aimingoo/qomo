var undefined = void null;

// for Object object
Object.prototype.propertyIsEnumerable = function(proName) {
  switch (proName+='') {
    case 'propertyIsEnumerable': case 'hasOwnProperty': case 'isPrototypeOf': return false;
    case 'call': case 'apply': case 'caller': case 'arguments': return !(this instanceof Function);
    case 'splice': case 'push': case 'pop': case 'shift': case 'unshift': return !(this instanceof Array);
    case 'toLocaleLowerCase': case 'toLocaleUpperCase': case 'charCodeAt': case 'localeCompare': return !(this instanceof String);
    case 'toDateString': case 'toTimeString': case 'toLocaleDateString': case 'toLocaleTimeString': return !(this instanceof Date);
    case 'toExponential': case 'toFixed': case 'toPrecision': return !(this instanceof Number);
    case 'name': case 'message': return !(this instanceof Error);
    default:
      for (var i in this) {
        if (i==proName) return true;
      }
  }
  return false;
}

Object.prototype.hasOwnProperty = function(proName) {
  var __proto__ = this.constructor.prototype;
  var value = __proto__[proName+=''];

  if (this[proName] !== value) return true;
  if (value === undefined) {
    for (var i in __proto__) {
      // defined in prototype, and no-changed
      if (i==proName) return false;  // has undefined value
    }
    for (var i in this) {
      // defined in the instance, and value is 'undefined'
      if (i==proName) return true;
    }
  }
  return false;  // hasn't the proName or value no-changed
}

Object.prototype.isPrototypeOf = function(object2) {
  var c = this.constructor;
  while (typeof c == 'function' && c !== Function) {
    if (c.prototype==object2) return true;
    c = c.prototype;
  }
  return false;
}

// for Array object
Array.prototype.splice = function(start, deleteCount) {
  if (deleteCount < 0) deleteCount = 0;
  if (start > this.length) start = this.length;
  if (start < 0 && (start+=this.length) < 0) start = 0;
  var arr = this.slice(start, start+deleteCount);
  if (arguments.length<3 && arr.length==0) return [];

  arguments.slice = Array.prototype.slice;
  var all = arguments.slice(2).concat(this.slice(start+deleteCount));
  var num=all.length, i=(this.length=start+num);
  // push all
  while (0<num--) this[--i] = all[num];
  return arr;
}

Array.prototype.push = function() {
  var args=arguments, argn=args.length, i=this.length+=argn;
  while (0<argn--) this[--i] = args[argn];
  return this.length;
}

Array.prototype.pop = function() {
  with (this) if (length>0) { var v = this[length-1]; length--; return v }
}

Array.prototype.shift = function() {
  with (this) { reverse(); var v=pop(); reverse(); return v; }
}

Array.prototype.unshift = function() {
  this.reverse();
  arguments.reverse = Array.prototype.reverse;
  this.push.apply(this, arguments.reverse());
  return this.reverse();
}

// for Function object
void function() {
  var _args = function(n){
    var i=1, s='(';
    if (n>0) for (s+='v[0]'; i<n; i++) s += ', v[' + i +']';
    return _args[n] = s+');'
  }

  function _apply(obj, args) {
    if (arguments.length=0) return this();  // todo: safe stack!

    var v = args;
    var n = v ? v.length.valueOf() : 0;
    var cmd = obj ? ['obj[""] = arguments[0]; var r=obj[""]', '', 'try {delete obj[""]} catch(e){}; return r;'] : ['return arguments[0]', ''];

    // make arguments string
    if (!(cmd[1] = _args[n])) cmd[1] = _args(n);

    /**
     * package object for value-type
     */
    if (!(obj===undefined || obj===null)) {
      switch (typeof obj) {
        case 'string': obj = new String(obj); break;
        case 'number': obj = new Number(obj); break;
        case 'boolean': obj = new Boolean(obj); break;
      }
    }

    /**
     * call with safe stack:
     *   step 1: make a local function
     *   step 2: call the local function
     * next code will lose stack:
     *    var cmd = obj ? ['var r=obj[""]', '', 'delete obj[""]; r;'] : ['this', ''];
     *    ...
     *    return eval(cmd.join(''));  // and del 're
     */
    eval('var __local_function = function() {' + cmd.join('') + '}');
    return __local_function(this);
  }

  Function.prototype.call = function (obj) {
    arguments.slice = Array.prototype.slice;
    return this.apply(obj, arguments.slice(1));
  }

  Function.prototype.apply = _apply;
}();

// for RegExp Object
void function() {
  var _exec = RegExp.prototype.exec;
  var NONE = new Array('');
  var _len = 0;

  //RegExp global object fixed by regexp.exec(), test() and
  //string.match(), replace(), split(), search() method.

  function _SetRegExp(arr) {
    // set RegExp.$1..$9
    for (var i=1, n=Math.min(10, arr.length); i<n; i++) RegExp['$'+i] = arr[i];
    // clear old value
    while (n<10) RegExp['$'+n++] = '';

    RegExp["$_"] = RegExp.input;
    RegExp["$&"] = RegExp.lastMatch = arr[0];
    RegExp["$+"] = RegExp.lastParen = arr[arr.length-1];
  }

  RegExp.prototype.exec = function (str){
    var arr = _exec.call(this, str);
    if (arr === null) arr = NONE;
    _SetRegExp(arr, RegExp.input);
    RegExp["$`"] = RegExp.leftContext = RegExp.input.substr(0, RegExp.index);
    RegExp["$'"] = RegExp.rightContext = RegExp.input.substr(RegExp.lastIndex);

    this.lastIndex = RegExp.lastIndex;
    return (arr == NONE ? null : arr);
  }

  String.prototype.search = function (r){
    r.lastIndex = 0;
    return (r.exec(this) ? RegExp.index : -1);
  }

  var _pattern, _strReplace = function() {
    var n,c,s=_pattern[0], m=Math.min(arguments.length-3, 99);
    for (var i=1,imax=_pattern.length; i<imax; i++) {
      if (isNaN(n=parseInt(_pattern[i]))) {
        switch (c=_pattern[i].charAt(0)) {
          case "&":
          case "'": s += RegExp['$'+c] + _pattern[i].substr(1); break;
          case "" : break;
          case "`": // $debug('warning: is very inefficient in IE5.0x
          default : s += '$' + _pattern[i];   //'$' and other
        }
      }
      else {
        s += (n>m ? _pattern[i] : arguments[n] + _pattern[i].substr(n.toString.length));
      }
    }
    return s;
  }

  var _replace = String.prototype.replace;
  String.prototype.replace = function (r, f){
    if (!(r instanceof RegExp)) return _replace.call(this, r, f);

    if (f instanceof Function) {
      var flags = r.toString();
      flags = flags.substr(flags.lastIndexOf('/'));
      var arr, args, s=this, p=0, v=[], global = flags.indexOf('g') > 0;

      r.exec = _exec;
      try {
        do {
          arr = r.exec(s);
          if (!arr) {
            v[v.length] = s;  // push
            break;
          }
          else {
            // BUG: in replaceFunction, next value is faked!!!
            //  RegExp.index, RegExp.lastIndex, RegExp.input
            _SetRegExp(arr);
            RegExp["$'"] = RegExp.rightContext = s.substr(RegExp.lastIndex);

            // inefficient! so skip...
            // RegExp["$`"] = RegExp.leftContext = this.substr(0, RegExp.index+p); //fix left

            args = arr.concat([RegExp.index+p, this]);
            v[v.length] = s.substr(0, RegExp.index);  // push, left string
            p += RegExp.lastIndex;                    // move position
            s = RegExp.rightContext;                  // next is rightContext
            v[v.length] = f.apply(null, args);        // push, replace match string
          }
        } while (global);
      }
      finally {
        r.exec = RegExp.prototype.exec;
      }
      return v.join('');
    }
    else {
      if (f.indexOf('$') == -1) {
        return _replace.call(this, r, f);
      }
      else {
        _pattern = f.toString().split('$');
        return this.replace(r, _strReplace);
      }
    }
  }
}();


/**
 * some code from iecompat.js
 * by Ma Bingyao <andot@ujn.edu.cn>
 *
 * can't implement
 *  - Function.prototype.length = 0;
 *  - Arguments.prototype.callee = null;
 * with some bug
 *  - Error object
 *  - Object.prototype.hasOwnProperty
 *  - String.toLocaleLowerCase
 *  - String.toLocaleUpperCase
 *  - String.localeCompare
*/

// for Date Object types
void function(p) {
  p.toDateString = function () {
    with (this.toString().split(' ')) { return slice(0,3).concat(slice(5,6)).join(' ') }
  }

  p.toTimeString = function () {
    return this.toString().split(' ').slice(3,5).join(' ');
  }

  p.toLocaleDateString = function () {
    return this.toLocaleString().split(' ')[0];
  }
   
  p.toLocaleTimeString = function () {
    return this.toLocaleString().split(' ')[1];
  }
}(Date.prototype);

// reformative vbs_JoinBytes(),  by aimingoo
window.execScript(''+
'Function vbs_JoinBytes(body) \n'+
'  Dim i, l, n, c1, c2, S, SS() \n'+
'  S = CStr(body) \n'+
'  l = LenB(S) \n'+
'  ReDim SS(l) \n'+

'  n = 0 \n'+
'  For i = 1 To l \n'+
'    c1 = AscB(MidB(S, i, 1)) \n'+
'    If c1 < &H80 Then \n'+
'      SS(n) = Chr(c1) \n'+
'    Else \n'+
'      c2 = AscB(MidB(S, i+1, 1)) \n'+
'      SS(n) = Chr(CLng(c1) * &H100 + c2) \n'+
'      i = i + 1  \n'+
'    End If \n'+
'    n = n + 1 \n'+
'  Next \n'+
'  vbs_JoinBytes = Join(SS, vbNullString) \n'+
'End Function \n'+

'Function vbs_CharCodeAt(c) \n'+
'  vbs_CharCodeAt = AscW(c) \n'+
'End Function','VBScript');

// for String Object types
void function(p) {
  p.toLocaleLowerCase = p.toLowerCase;

  p.toLocaleUpperCase = p.toUpperCase;

  p.charCodeAt = function(index) {
    var c = vbs_CharCodeAt(this.charAt(index));
    return (c < 0 ? c + 0x10000 : c);
  }

  p.localeCompare = function (str) {
    return (this>str) ? 1
      : (this<str) ? -1
      : 0;
  }
}(String.prototype);

// for Number Object types
Number.prototype.toExponential = function (n) {
  function repeat(s, n) {
    var out = "";
    for (var i = 0; i < n; i++) {
      out += s;
    }
    return out;
  }
  if (!n) {
    n = 0;
  }
  else {
    n = parseInt(n);
    if (n < 0 || n > 20) {
      var e = new Error(-2146823262, "The number of fractional digits is out of range");
      e.name = "RangeError";
      e.message = e.description;
      throw(e);
    }
  }
  var s, d, e, len;
  s = this.toString().split("e");
  d = parseFloat(s[0]);
  e = 0;
  if (typeof(s[1]) != "undefined") {
    e = parseInt(s[1]);
  }
  s = d.toString().split(".");
  if (typeof(s[1]) != "undefined") {
    e = e - s[1].length;
    d = s[0] + s[1];
    d = d.replace(/^0+/g, "");
    if (d == "") d = "0";
  }
  s = d.toString();
  len = s.length - 1;
  e += len;
  if (len < n) {
    s += repeat("0", n - len);
  }
  else if (len > n) {
    s = Math.round(parseFloat("." + s) * Math.pow(10, n + 1)).toString();
    if ((s.length - 1) > n) {
      e += 1;
      s = Math.round(parseFloat("." + s) * Math.pow(10, n + 1)).toString();
    }
  }
  if (e >= 0) {
    e = "+" + e;
  }
  if (n == 0) {
    return s + "e" + e;
  }
  else {
    return s.substr(0, 1) + "." + s.substr(1) + "e" + e;
  }
}
 
Number.prototype.toFixed = function (n) {
  function repeat(s, n) {
    var out = "";
    for (var i = 0; i < n; i++) {
      out += s;
    }
    return out;
  }
  if (!n) {
    n = 0;
  }
  else {
    n = parseInt(n);
    if (n < 0 || n > 20) {
      var e = new Error(-2146823262, "The number of fractional digits is out of range");
      e.name = "RangeError";
      e.message = e.description;
      throw(e);
    }
  }
  var s, d, e, len;
  s = this.toString().split("e");
  d = parseFloat(s[0]);
  e = 0;
  if (typeof(s[1]) != "undefined") {
    e = parseInt(s[1]);
  }
  s = d.toString().split(".");
  if (typeof(s[1]) != "undefined") {
    e = e - s[1].length;
    d = s[0] + s[1];
    d = d.replace(/^0+/g, "");
    if (d == "") d = "0";
  }
  s = d.toString();
  len = s.length - 1;
  
  if (e >= 0) {
    s += repeat("0", e);
    if (n > 0) {
      s += "." + repeat("0", n);
    }
  }
  else if (-e <= n) {
    s = repeat("0", 1 - e - s.length) + s;
    s = s.substr(0, s.length + e) + "." + s.substr(s.length + e) + repeat("0", n + e);
  }
  else {
    s = repeat("0", 1 - e - s.length) + s;
    d = parseFloat(s.substr(0, s.length + e) + "." + s.substr(s.length + e));
    s = Math.round(d * Math.pow(10, n)).toString();
    if (n > 0) {
      s = repeat("0", n - s.length + 1) + s;
      s = s.substr(0, s.length - n) + "." + s.substr(s.length - n);
    }
  }
  return s;
}
 
Number.prototype.toPrecision = function (n) {
  function repeat(s, n) {
    var out = "";
    for (var i = 0; i < n; i++) {
      out += s;
    }
    return out;
  }
  if (typeof(n) == "undefined") {
    return this.toString();
  }
  else {
    n = parseInt(n);
    if (n < 1 || n > 21) {
      var e = new Error(-2146823262, "The precision is out of range");
      e.name = "RangeError";
      e.message = e.description;
      throw(e);
    }
  }
  if (this.valueOf() == 0) {
    if (n == 1) return "0";
    return "0." + repeat("0", n - 1);
  }
  var s, d, e, len;
  s = this.toString().split("e");
  d = parseFloat(s[0]);
  e = 0;
  if (typeof(s[1]) != "undefined") {
    e = parseInt(s[1]);
  }
  s = d.toString().split(".");
  if (typeof(s[1]) != "undefined") {
    e = e - s[1].length;
    d = s[0] + s[1];
    d = d.replace(/^0+/g, "");
    if (d == "") d = "0";
  }
  s = d.toString();
  len = s.length;
  d = parseFloat("." + s) * Math.pow(10, n);
  s = Math.round(d).toString();
  if (s.length > parseInt(d).toString().length) {
    e++;
    s = s.slice(0, -1);
  }
  e += len - s.length;
  len = s.length;
  e += len - 1;
 
  if (e < n && e > -7) {
    if ((e < n - 1) && (e > 0)) {
      s = s.substr(0, e + 1) + "." + s.substr(e + 1);
    }
    else if (e <= 0) {
      s = repeat("0", - e) + s;
      s = s.substr(0, 1) + "." + s.substr(1);
    }
  }
  else {
    if (len < n) {
      s += repeat("0", n - len);
    }
    if (e >= 0) {
      e = "+" + e;
    }
    if (n == 1) {
      s += "e" + e;
    }
    else {
      s = s.substr(0, 1) + "." + s.substr(1) + "e" + e;
    }
  }
  return s;
}

// for global object
function encodeURI(str) {
    var l = ['%00', '%01', '%02', '%03', '%04', '%05', '%06',
             '%07', '%08', '%09', '%0A', '%0B', '%0C', '%0D',
             '%0E', '%0F', '%10', '%11', '%12', '%13', '%14',
             '%15', '%16', '%17', '%18', '%19', '%1A', '%1B',
             '%1C', '%1D', '%1E', '%1F', '%20', '!', '%22',
             '#', '$', '%25', '&', "'", '(', ')', '*', '+', ',',
             '-', '.', '/', '0', '1', '2', '3', '4', '5', '6',
             '7', '8', '9', ':', ';', '%3C', '=', '%3E', '?',
             '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
             'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
             'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '%5B', '%5C',
             '%5D', '%5E', '_', '%60', 'a', 'b', 'c', 'd', 'e',
             'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
             'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
             'z', '%7B', '%7C', '%7D', '~', '%7F'];
  var out, i, j, len, c, c2;
 
  out = [];
  len = str.length;
  for (i = 0, j = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c <= 0x007F) {
      out[j++] = l[c];
      continue;
    }
    else if (c <= 0x7FF) {
      out[j++] = '%' + (0xC0 | ((c >>  6) & 0x1F)).toString(16).toUpperCase();
      out[j++] = '%' + (0x80 | (        c & 0x3F)).toString(16).toUpperCase();
      continue;
    }
    else if (c < 0xD800 || c > 0xDFFF) {
      out[j++] = '%' + (0xE0 | ((c >> 12) & 0x0F)).toString(16).toUpperCase();
      out[j++] = '%' + (0x80 | ((c >>  6) & 0x3F)).toString(16).toUpperCase();
      out[j++] = '%' + (0x80 |         (c & 0x3F)).toString(16).toUpperCase();
      continue;
    }
    else {
      if (++i < len) {
        c2 = str.charCodeAt(i);
        if (c <= 0xDBFF && 0xDC00 <= c2 && c2 <= 0xDFFF) {
          c = ((c & 0x03FF) << 10 | (c2 & 0x03FF)) + 0x010000;
          if (0x010000 <= c && c <= 0x10FFFF) {
            out[j++] = '%' + (0xF0 | ((c >>> 18) & 0x3F)).toString(16).toUpperCase();
            out[j++] = '%' + (0x80 | ((c >>> 12) & 0x3F)).toString(16).toUpperCase();
            out[j++] = '%' + (0x80 | ((c >>>  6) & 0x3F)).toString(16).toUpperCase();
            out[j++] = '%' + (0x80 |          (c & 0x3F)).toString(16).toUpperCase();
            continue;
          }
        }
      }
    }
    var e = new Error(-2146823264, "The URI to be encoded contains an invalid character");
    e.name = "URIError";
    e.message = e.description;
    throw(e);
  }
  return out.join('');
}
 
function encodeURIComponent(str) {
    var l = ['%00', '%01', '%02', '%03', '%04', '%05', '%06',
             '%07', '%08', '%09', '%0A', '%0B', '%0C', '%0D',
             '%0E', '%0F', '%10', '%11', '%12', '%13', '%14',
             '%15', '%16', '%17', '%18', '%19', '%1A', '%1B',
             '%1C', '%1D', '%1E', '%1F', '%20', '!', '%22',
             '%23', '%24', '%25', '%26', "'", '(', ')', '*', '%2B', '%2C',
             '-', '.', '%2F', '0', '1', '2', '3', '4', '5', '6',
             '7', '8', '9', '%3A', '%3B', '%3C', '%3D', '%3E', '%3F',
             '%40', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
             'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
             'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '%5B', '%5C',
             '%5D', '%5E', '_', '%60', 'a', 'b', 'c', 'd', 'e',
             'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
             'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
             'z', '%7B', '%7C', '%7D', '~', '%7F'];
  var out, i, j, len, c;
 
  out = [];
  len = str.length;
  for(i = 0, j = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c <= 0x007F) {
      out[j++] = l[c];
      continue;
    }
    else if (c <= 0x7FF) {
      out[j++] = '%' + (0xC0 | ((c >>  6) & 0x1F)).toString(16).toUpperCase();
      out[j++] = '%' + (0x80 | (        c & 0x3F)).toString(16).toUpperCase();
      continue;
    }
    else if (c < 0xD800 || c > 0xDFFF) {
      out[j++] = '%' + (0xE0 | ((c >> 12) & 0x0F)).toString(16).toUpperCase();
      out[j++] = '%' + (0x80 | ((c >>  6) & 0x3F)).toString(16).toUpperCase();
      out[j++] = '%' + (0x80 |         (c & 0x3F)).toString(16).toUpperCase();
      continue;
    }
    else {
      if (++i < len) {
        c2 = str.charCodeAt(i);
        if (c <= 0xDBFF && 0xDC00 <= c2 && c2 <= 0xDFFF) {
          c = ((c & 0x03FF) << 10 | (c2 & 0x03FF)) + 0x010000;
          if (0x010000 <= c && c <= 0x10FFFF) {
            out[j++] = '%' + (0xF0 | ((c >>> 18) & 0x3F)).toString(16).toUpperCase();
            out[j++] = '%' + (0x80 | ((c >>> 12) & 0x3F)).toString(16).toUpperCase();
            out[j++] = '%' + (0x80 | ((c >>>  6) & 0x3F)).toString(16).toUpperCase();
            out[j++] = '%' + (0x80 |          (c & 0x3F)).toString(16).toUpperCase();
            continue;
          }
        }
      }
    }
    var e = new Error(-2146823264, "The URI to be encoded contains an invalid character");
    e.name = "URIError";
    e.message = e.description;
    throw(e);
  }
  return out.join('');
}
 
function decodeURI(str) {
  function throwerror() {
    var e = new Error(-2146823263, "The URI to be decoded is not a valid encoding");
    e.name = "URIError";
    e.message = e.description;
    throw(e);
  }
  function checkcode() {
    var d1, d2;
    d1 = str.charAt(i++);
    d2 = str.charAt(i++);
    if (isNaN(parseInt(d1, 16)) || isNaN(parseInt(d2, 16))) {
      return throwerror();
    }
    return parseInt(d1 + d2, 16);
  }
  function checkutf8() {
    var c = str.charCodeAt(i++);
    if (c == 37) {
      if ((c = checkcode()) == null) return null;
    }
    if ((c >> 6) != 2) {
      return throwerror();
    }
  }
  var out, i, j, len;
  var c, c2, c3, c4, s;
 
  out = [];
  len = str.length;
  i = j = 0;
  while(i < len) {
    c = str.charCodeAt(i++);
    if (c == 37) {
      if ((c = checkcode()) == null) return null;
    }
    else {
      out[j++] = String.fromCharCode(c);
      continue;
    }
    switch(c) {
      case 35: case 36: case 38: case 43: case 44: case 47:
      case 58: case 59: case 61: case 63: case 64: {
        if (str.charCodeAt(i - 3) == 37) {
          out[j++] = str.substr(i - 3, 3);
        }
        else {
          out[j++] = str.substr(i - 1, 1);
        }
        break;
      }
      default: {
        switch (c >> 4) { 
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
            // 0xxxxxxx
            out[j++] = String.fromCharCode(c);
            break;
          }
          case 12: case 13: {
            // 110x xxxx   10xx xxxx
            if ((c2 = checkutf8()) == null) return null;
            out[j++] = String.fromCharCode(((c & 0x1F) << 6) | (c2 & 0x3F));
            break;
          }
          case 14: {
            // 1110 xxxx  10xx xxxx  10xx xxxx
            if ((c2 = checkutf8()) == null) return null;
            if ((c3 = checkutf8()) == null) return null;
            out[j++] = String.fromCharCode(((c & 0x0F) << 12) |
              ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
            break;
          }
          default: {
            switch (c & 0xf) {
              case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
                // 1111 0xxx  10xx xxxx  10xx xxxx  10xx xxxx
                if ((c2 = checkutf8()) == null) return null;
                if ((c3 = checkutf8()) == null) return null;
                if ((c4 = checkutf8()) == null) return null;
                s = ((c  & 0x07) << 18) |
                  ((c2 & 0x3f) << 12) |
                  ((c3 & 0x3f) <<  6) |
                  (c4 & 0x3f) - 0x10000;
                if (0 <= s && s <= 0xfffff) {
                  out[j++] = String.fromCharCode(((s >>> 10) & 0x03ff) | 0xd800,
                                                  (s         & 0x03ff) | 0xdc00);
                }
                else {
                  return throwerror();
                }
                break;
              }
              default: {
                return throwerror();
              }
            }
          }
        }
      }
    }
  }
  return out.join('');
}
 
function decodeURIComponent(str) {
  function throwerror() {
    var e = new Error(-2146823263, "The URI to be decoded is not a valid encoding");
    e.name = "URIError";
    e.message = e.description;
    throw(e);
  }
  function checkcode() {
    var d1, d2;
    d1 = str.charAt(i++);
    d2 = str.charAt(i++);
    if (isNaN(parseInt(d1, 16)) || isNaN(parseInt(d2, 16))) {
      return throwerror();
    }
    return parseInt(d1 + d2, 16);
  }
  function checkutf8() {
    var c = str.charCodeAt(i++);
    if (c == 37) {
      if ((c = checkcode()) == null) return null;
    }
    if ((c >> 6) != 2) {
      return throwerror();
    }
  }
  var out, i, j, len;
  var c, c2, c3, c4, s;
 
  out = [];
  len = str.length;
  i = j = 0;
  while(i < len) {
    c = str.charCodeAt(i++);
    if (c == 37) {
      if ((c = checkcode()) == null) return null;
    }
    else {
      out[j++] = String.fromCharCode(c);
      continue;
    }
    switch(c >> 4) { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
        // 0xxxxxxx
        out[j++] = String.fromCharCode(c);
        break;
      }
      case 12: case 13: {
        // 110x xxxx   10xx xxxx
        if ((c2 = checkutf8()) == null) return null;
        out[j++] = String.fromCharCode(((c & 0x1F) << 6) | (c2 & 0x3F));
        break;
      }
      case 14: {
        // 1110 xxxx  10xx xxxx  10xx xxxx
        if ((c2 = checkutf8()) == null) return null;
        if ((c3 = checkutf8()) == null) return null;
        out[j++] = String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
        break;
      }
      default: {
        switch (c & 0xf) {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: {
            // 1111 0xxx  10xx xxxx  10xx xxxx  10xx xxxx
            if ((c2 = checkutf8()) == null) return null;
            if ((c3 = checkutf8()) == null) return null;
            if ((c4 = checkutf8()) == null) return null;
            s = ((c  & 0x07) << 18) |
              ((c2 & 0x3f) << 12) |
              ((c3 & 0x3f) <<  6) |
              (c4 & 0x3f) - 0x10000;
            if (0 <= s && s <= 0xfffff) {
              out[j++] = String.fromCharCode(((s >>> 10) & 0x03ff) | 0xd800,
                                          (s         & 0x03ff) | 0xdc00);
            }
            else {
              return throwerror();
            }
            break;
          }
          default: {
            return throwerror();
          }
        }
      }
    }
  }
  return out.join('');
}


// for other Object types
Error.prototype.name = '';
Error.prototype.message = 'error';

void function() {
  ie5_parser = function(str) {
    // ...
    return str;
  }
/*
  window.execScript = function(str, type) {
    _exec(ie5_parser(str), type);
  }
*/
}();

$import('common_ie55.js');