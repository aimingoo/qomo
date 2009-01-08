/**
 * - comment only -
 * RegExp.lastParen will return invalid in IE6
 */

/**
 * serialization function uneval()
 *
 * reconstruct the JScript source for data structures
 *
 * citing codes writed by Esteban Al'Capousta showed on
 * http://not.from.kiev.ua/biz/000157.html as a reference.
 */
var uneval = function() {
  var types = {};
  var r_quote = /([^\\]?)"/g; // dealing with " 

  types[Number] =
  types[Function] =
  types[Boolean] =
  types[RegExp] = function(value){ return value }
  types[String] = function(value){ return "\"" + value.replace(r_quote,"$1\\\"") + "\"" }
  types[Date] = function(value){ return "new Date(" + value.valueOf() + ")" }
  types[Array] = function(value){
    var i=0, imax=value.length, r=new Array(imax);
    for(;i<imax;i++) r[i] = uneval(value[i]);
    return"["+r.join(",")+"]\r\n";
  }
  types[Object] = function(value){
    var r=[];
    for (var key in value) {
      r.push(uneval(key)+":"+uneval(value[key]));
    }
    return r.length?"{"+r.join(",\r\n")+"}\r\n":"new Object()";
  }

  return function(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    ///Special treatment of non-native objects..
    if(value["constructor"] === undefined) {
      return "new Object("+(value instanceof ActiveXObject ? "/*ActiveXObject*/" : "")+")";
    }

    var f = types[value.constructor];
    return (f !== undefined ? f(value) : "new Object(/*unrecognised: "+value+"*/)")
  }
}();

$import('private_ie1.js', $Q('IeAabsolutePath'));
$import('private_ie2.js', $Q('IeDecode'));
$import('common_js16.js');
