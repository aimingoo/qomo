/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.04.17]

 - Profilers Object
 - a global profilers object instance
*****************************************************************************/

/**
 * Debug Util: Profilers object
 *  - with a global profilers object
 */
Profilers = function () {
  var profs = this;
  var signs = {};
  var datas = {};

  function Profiler(name) {
    signs[name] = [];
    datas[name] = {};
    this.toString = new Function('return "' + name + '"');
  }

  Profiler.prototype = {
    begin : function() { 
      var idx = signs[this].push((new Date()).valueOf(), 0) - 2;
      return this + '(' + idx + ')' + signs[this][idx];
    },
    end : function(v) {
      var t=signs[this], i=t.length-1;
      if (v) {
        v = v.toString().replace(this, '');
        if (v.charAt(0) == '(') {
          i = parseInt(v.substr(1));
          if (t[i] != v.substr(v.indexOf(')') + 1)) return;
        }
      }
      return (t[i+1] = (new Date()).valueOf());
    },
    toData : function() { return signs[this].slice(0) },
    get : function(n) { return datas[this][n] },
    set : function(n, v) { datas[this][n] = v }
  }

  var prof = function() {
    var n = Array.prototype.join.call(arguments, '/');
    return ((n in profs) ? profs[n] : profs[n]=new Profiler(n));
  }

  /**
   * clone a data object. if you want convert to Date Object:
   *     var conv = function (e, i, a) { a[i] = new Date(a[i]) }
   *     for (var n in data) data[n].forEach(conv);
   */
  prof.toData = function() {
    var result = {};
    for (var n in signs) {
      if (signs[n] instanceof Array) { // skip functions
        result[n] = signs[n].slice(0);
      }
    }
    return result;
  }

  return prof;
}
$profilers = new Profilers();