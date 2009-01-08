/**
 *  JavaScript 1.6 extensions
 *
 *  extension of "Array"
 */
Array.prototype.indexOf = function (v, idx) { /* [, fromIndex ] */
  var len=this.length, i=(arguments.length<2 ? 0 : (idx<0 ? Math.max(0, len+idx) : idx));
  for (; i<len; i++) if (this[i]==v) return i;
  return -1;
}

Array.prototype.lastIndexOf = function (v, idx) { /* [, fromIndex ] */
  var i=(arguments.length<2 ? this.length-1 : (idx<0 ? Math.max(0, this.length+idx) : idx));
  for (; i>=0; i--) if (this[i]==v) return i;
  return -1;
}

/* how to replace for..in by forEach? next sample:
for (var i in obj) {
  // i      ==> name
  // obj[i] ==> value
}

arr.forEach(function(e,i,a) {
  // e      ==> name
  // arr[i] ==> value
  // a      ==> is the <arr> always
  // this   ==> specify thisObject at forEach calling, or the <arr>
})
*/
void function() {
  var breakEach = {};

  // callback = function (element, index, array) {};
  Array.prototype.forEach = function(callback, thisObject) {
    if (!thisObject) thisObject = this;

    for (var i=0, len=this.length; i<len; i++) {
      if (breakEach === callback.call(thisObject, this[i], i, this)) break;
    }
  }

  Array.prototype.every = function(f, thisObject) {
    var v = true; foo=function() { if (!f.apply(this, arguments)) { v=false; return breakEach } }
    this.forEach(foo, thisObject);
    return v;
  }

  Array.prototype.some = function(f, thisObject) {
    var v = false; foo=function() { if (f.apply(this, arguments)) { v=true; return breakEach }}
    this.forEach(foo, thisObject);
    return v;
  }

  Array.prototype.filter = function(f, thisObject) {
    var v=[], foo=function() { if (f.apply(this, arguments)) v.push(arguments[0]) }
    this.forEach(foo, thisObject);
    return v;
  }

  Array.prototype.map = function(f, thisObject) {
    var v=[], foo=function() { v.push(f.apply(this, arguments)) }
    this.forEach(foo, thisObject);
    return v;
  }
}();

/**
 *  JavaScript 1.6 extensions
 *
 *  extension of "String"
 */
if (!String.prototype.quote) {
  String.prototype.quote = function () {
    return '"' + this.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + '"';
  }
}

/**
 *  JavaScript 1.6 extensions
 *
 *  extension of "generic":
 *  you can import codes in js16generics.js from Erik Arvidsson,
 *  see http://erik.eae.net/archives/2006/02/28/00.39.52/
 */