/* opera not support Function.prototype.caller
 * note: aimingoo
 */

// for RegExp Object
void function() {
  var _exec = RegExp.prototype.exec;

  RegExp.prototype.exec = function (str) {
    var arr = _exec.call(this, str);
    var r = RegExp;

    r["$_"] = r.input = str;
    r["$&"] = r.lastMatch = (!arr ? '' : arr[0]);
    r["$+"] = r.lastParen = (!arr ? '' : arr[arr.length-1]);
    r["$`"] = r.leftContext;
    r["$'"] = r.rightContext;

    r.index = r.leftContext.length;
    r.lastIndex = r.index + r.lastMatch.length;

    return arr;
  }

  String.prototype.search = function (r){
    r.lastIndex = 0;
    return (r.exec(this) ? RegExp.index : -1);
  }
}();

void function() {
  var $import_setter = $import.set;
  $import.setActiveUrl = function(url) {
    $import_setter('curScript', url);
  }
}();

$import('common_js16.js');