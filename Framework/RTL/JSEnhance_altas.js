/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.25]

 - code copy from altas or compatible it
*****************************************************************************/

/**
 *  base object system extend - Array
 */
Array.prototype.dequeue = function() {
  return this.shift();
}
Array.prototype.queue = function(item) {
  this.push(item);
}

Array.prototype.clone = function() {
  return this.slice(0);
}
Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
}
Array.prototype.remove = function(item) {
  var index = this.indexOf(item);
  if (index >= 0) {
    this.splice(index, 1);
  }
}

Array.prototype.get_length = function() {
    return this.length;
}
Array.prototype.getItem = function(index) {
    return this[index];
}

Array.prototype.indexOfKey = function(k) {
  return ((k==+k) && (this[k]!==undefined)) ? k : -1;
}
Array.prototype.existValue = function (v) {
  return this.indexOf(v) != -1
}
Array.prototype.existKey = function (k) {
  return this.indexOfKey(k) != -1
}


/**
 *  base object system extend - String
 */
void function() {
  String.format = function(format) {
    for (var i = 1; i < arguments.length; i++) {
      format = format.replace("{" + (i - 1) + "}", arguments[i]);
    }
    return format;
  }
}();



/**
 * parse for types
 */

Boolean.parse = function(value) {
  return ((typeof value == 'string') || (value instanceof String) ? value.toLowerCase() == 'true' : !!value);
}

// null, false, undefined, 0, ''  ==> 0
// true ==> 1
// toString() ==> StringToFloat
// ==> NaN
Number.parse = function(value) {
  return (!value ? 0 : ((typeof value == 'boolean') || (value instanceof Boolean) ? 1 : parseFloat(value));
}

// '[1,2,3]'
Array.parse = function(value) {
  return eval('(' + value + ')');
}

// '/.../mgi'
RegExp.parse = function(value) {
  return (value.toString().search(/^\/(.*)\/([mgi]{0,3})$/) == -1 ? null
    : new RegExp(RegExp.$1, RegExp.$2))
}

Date.parse = function(value) {
  // TODO
}

// functionName
Function.parse = function(functionName) {
  var fn = null;
  try {
    if (typeof fn=eval(functionName) != 'function')
      return (fn instanceof Function ? fn : null)
  }
  catch (ex) {}
  return fn;
}