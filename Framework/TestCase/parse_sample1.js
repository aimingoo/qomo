/********************************************************
Qomolangma OpenProject v2.0
[v2.0 alpha 1 release 2007.06.01]
********************************************************/

/*****************************************************************************
Qomo Project v1.0
  [Aimingoo(aim@263.net)]
  [2006.01.29]

 - need use <script> tag to load Qomo.js unit. can't $import() for this,
   because $import() implement by Qomo.js.
 - you can rename Qomo.js (IE only).
 - you can append or change initialize list at end of the unit.
*****************************************************************************/

/**
 * Common toString handle for Core: $QomoCoreFunction()
 */
$QomoCoreFunction = function (name) {
  return new Function("return 'function " + name + "() {\\n    [qomo_core code]\\n}'");
}

/**
 * execScript method for window object
 * note this will cause compatiable errors and will be rewrited in CompatLayer
 */
if (window.execScript == null) {
  window.execScript = function(script, type) {
    // window.eval(script);
    // next is faster
    eval.apply(window, [script]);
  }
}

/**
 * Debug output function: $debug()
 * - (IE only, ) $debug = document.writeln;
 */
$debug = function() {
  arguments.join = Array.prototype.join;
  document.writeln(arguments.join(''));
}

/**
 * Ajax class, for core only
 */
function Ajax() {
  var http = (
    /**
     * If IE7, Mozilla, Safari, etc: Use native object.
     * Native XMLHttpRequest in IE 7 has a strict permission,
     * see http://forums.microsoft.com/MSDN/ShowPost.aspx?PostID=839863&SiteID=1
     */
    window.XMLHttpRequest ? function() {
        return new XMLHttpRequest()
    } :
    // get a XMLHTTP Object. you can append or re-order PROGIDS array.
    window.ActiveXObject ? function() {
      var PROGIDS = new Array(
        'MSXML2.XMLHTTP.7.0',  // try higher versions first
        'MSXML2.XMLHTTP.6.0', 
        'MSXML2.XMLHTTP.5.0', 
        'MSXML2.XMLHTTP.4.0', 
        'MSXML2.XMLHTTP.3.0', 
        'MSXML2.XMLHTTP',
        'MSXML3.XMLHTTP',
        'Microsoft.XMLHTTP'    // version independent one
      );
      for (var i=0;i < PROGIDS.length; i++) {
        try { return new ActiveXObject(PROGIDS[i]) } catch (e) {};
      }
    } :
    // undefined, failed
    function() { }
  )();

  if (!http) {
    $debug("Qomo's ajax core initialize failed!");
    throw new Error([0, 'Can\'t Find XMLHTTP Object!']);
  }

  return http;
}

/**
 * unit/package/namespace import function: $import()
 */
$import = function() {
  var _SYS_TAG = /\/Qomo\.js$/;
  var _r_path = /[^\/]*$/;
  var _r_protocol = /^\w+:\/{2,}[^\/]+\//;
  var is_msie = (navigator.userAgent.indexOf("MSIE") != -1 && !window.opera);
  function $JS() {
    var all = document.getElementsByTagName('script');
    for (var i=all.length-1; i>=0; i--) {
      if (is_msie) {
        if (all[i].readyState == 'interactive') return all[i].src;
      }
      else {
        if (_SYS_TAG.test(all[i].src)) return all[i].getAttribute('src');
      }
    }
    return '';
  }

  function $RURL(url) {
    if (url.indexOf('./') == -1) return url;

    var
      a, d = '/',
      p1 = (url.charAt(0)==d ? d : ''),
      p2 = (url.charAt(url.length-1)==d ? d : '');

    if (a = _r_protocol.exec(url)) {
      p1 = a[0];
      url = url.substr(p1.length);
    }

    for (var i=0, v=[], a=url.split(d); i<a.length; i++) {
      switch (a[i]) {
        case '..': v[(v.length>0 && v[v.length-1]!='..') ? 'pop' : 'push'](a[i]); // break defer
        case '.' :
        case ''  : break;
        default  : v.push(a[i]);
      }
    }
    p2 = v.join(d) + p2;
    return p1 + (p2=='/' ? '' : p2);
  }

  // support http://, file:/// and other protocols, for parseRelativeURL()
  var _sys = {
    'scripts': {}, // cache executed scripts
    'curScript': '', // current (importing and executing) active-script's URL
    'activeJS' : $JS, // get script src path of executing
    'parseRelativeURL': $RURL, // relative_url for a url. analy and replace '.' and '..' char(s).

    // decode for XMLHTTP.responseBody, default return responseText
    'bodyDecode': function(ajx) {
       return ajx.responseText
    },

    // (at initialization,) docBase is '', use relatived path system.
    'docBase' : function () {
      return '';
    }(),

    // (at initialization,) srcBase relative to Qomo.js <SCRIPT> Object's src attribute.
    'srcBase': function() {
      return $JS().replace(_r_path, '');
    }(),

    // (at initialization, it's relatived.)
    // path of current script(.js file) or active <SCRIPT> object's src attribute.
    'pathBase' : function() {
      var s = _sys.curScript || _sys.activeJS();
      if (!s) return _sys.docBase;

      // cut filename
      s = s.replace(_r_path, '');

      // convert relative to absolute path.
      return (s.charAt(0)=='/' ? '' : _sys.docBase) + s;
    },

    // transition url for Qomo.js's path architect
    'transitionUrl': function(url){
      return _sys.parseRelativeURL( (url.length==0 || url.charAt(0) == '/') ? url
        : _sys.curScript ? _sys.curScript.replace(_r_path, url)
        : _sys.pathBase()+url );
    }
  }

  var ajx = new Ajax();
  var ajaxLoad = function(src) {
    ajx.open("GET", src, false);
    ajx.send(null);
    if (ajx.status==200 || ajx.status==0) return _sys.bodyDecode(ajx);
    throw new Error([1, "AjaxLoad error at $import, Status: ", ajx.status]);
  }

  var _stack = []; // loading stack
  var _load_and_exec = function(src) {
    src = _sys.transitionUrl(src);
    if (typeof _sys.scripts[src] == 'undefined') {
      try {
        _sys.scripts[src] = null;
        var script = ajaxLoad(src);
        _stack[_stack.length] = _sys.curScript;
        _sys.curScript = src;
        try {
          window.execScript(script, 'JavaScript');
        }
        finally {
          if (_stack.length > 0) {
            _sys.curScript = _stack[_stack.length-1];
            _stack.length--;
          }
          else {
            _sys.curScript = '';
          }
        }
      }
      catch(e) {
        $debug('<P>$import() failed: ', src, '<BR /><DIV color="red">', e.message, '</DIV></P>');
        throw e;
      }
    }
  }

  function _import (target, condition) {
    if (arguments.length<2 || condition) {
      // $debug(target, '<BR>');
      _load_and_exec(target);
    }
  }

  _import.setActiveUrl = function(url) {
    // ignored in IE.
  }
  _import.get = function(n) {
    return (n=='perf_exec_stub' ? _load_and_exec : eval('_sys[n]'))
  }
  _import.set = function(n, v) {
    if (n == 'perf_exec_stub') {
      _load_and_exec = v;
    }
    else {
      eval('_sys[n] = v');

      // if update path architect with reset docBase, need reset URLs in _stack[]
      if (n=='docBase') {
        for (var i=0; i<_stack.length; i++) {
          if (!_stack[i]) continue;
          _stack[i] = _sys.parseRelativeURL( _sys.docBase + _stack[i] );
        }
      }
    }
  }
  _import.OnSysInitialized = function() {
    delete _import.set;
    delete _import.get;
    delete _import.OnSysInitialized;
    if (typeof($profilers) !== 'undefined' && $profilers.ResetImport) $profilers.ResetImport();
    _import.setActiveUrl('');
  }

  return _import;
}();

/**
 * code snippet inline
 */
$inline = function() {
  var $getter = $import.get;
  var bodyDecode = function(ajx) { return $getter('bodyDecode')(ajx) }
  var transitionUrl = function(src) { return $getter('transitionUrl')(src) }

  var ajx = new Ajax();
  function ajaxLoad(src) {
    // $debug(src, '<BR>');
    ajx.open("GET",transitionUrl(src), false);
    ajx.send(null);
    if (ajx.status==200 || ajx.status==0) return bodyDecode(ajx);
    throw new Error([1, "AjaxLoad error at $inline,  Status: ", ajx.status]);
  }

  var cache = {};
  return function(src, condition) {
    if (arguments.length<2 || condition) {
      return ((typeof cache[src] != 'undefined') ? cache[src] : cache[src] = ajaxLoad(src));
    }
  }
}();
/* context imported... */


// load system framework core
/* context imported... */


// load util or base classes.
/* context imported... */


// load components. customizable.
// $import('Components/Components.js');

// sytem Initialized.

void function () {
  var $setter = $import.set;
  $import.setActiveUrl = function(url) {
    $setter('curScript', url);
  }
}();

//$import.setActiveUrl("Framework/system.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.01.29]

 - you can append or change initialize list at end of the unit.
*****************************************************************************/


/**
 *  core framework load list
 */
/* context imported... */


// fix some bug(see document) with the compat layer!
/* context imported... */

//$import.setActiveUrl("Framework/Debug/Debug.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.04.17]

 - debugger and profiler unit
*****************************************************************************/

// a profiler object base native js
/* context imported... */


// (if you want hook core loading, )replace $import()
/* context imported... */


// utils function for debug framework
/* context imported... */


// a debugger window
// $import('Qomo.Debugger.js');
//$import.setActiveUrl("Framework/Debug/Profilers.js");
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
//$import.setActiveUrl("Framework/Debug/RepImport.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.04.17]

 - the unit will replace $import(), with profiler support
*****************************************************************************/

/* replace pref-detect for $import()
 *  - the core_key is "perf_exec_stub"
 */
void function(core_key) {
  function FN(path) {
    //return path.substr(path.lastIndexOf('/')+1);
    return path.replace(/.*[\/\\]/, '');
  }
  var $key = core_key;
  var $import_setter = $import.set;
  var stub_import = $import.get($key);
  var stub_inline = $inline; 

  $import_setter($key, function(url, condition){
    if (arguments.length<2 || condition) {
      var prof = $profilers('$import', FN(url));
      prof.set('url', url);

      var tag = prof.begin();
      try {
        stub_import(url)
      }
      finally {
        prof.end(tag)
      }
    }
    else {
      // log, or report...
    }
  });

  var cache = {};
  $inline = function(url, condition) {
    if (arguments.length<2 || condition) {
      // skip cached $inline entry
      if (url in cache) return stub_inline(url);

      var prof = $profilers('$inline', FN(url));
      prof.set('url', url);

      var tag = prof.begin();
      try {
        cache[url] = true;
        return stub_inline(url)
      }
      finally {
        prof.end(tag)
      }
    }
    else {
      // log, or report...
    }
  }

  $profilers.ResetImport = function() {
    $import_setter($key, stub_import);
    $inline = stub_inline;
    delete $profilers.ResetImport;
  }
}('perf_exec_stub');
//$import.setActiveUrl("Framework/Debug/Dbg.Utils.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.09.15]

 - debugger utils unit
*****************************************************************************/

/**
 * get all called functions from a function object's context
 */
getAllFunctions = function (ctx) {
  var r_func = /\'|\"|(\/)(.)|(\.|\$+|\b)([\$\w]+)\s*\(/g;
  var r_spc = /\s/;        // space char
  var r_div = /[\w\$\)]/;  // div expression from "\w\$\(" always!

  var pos, unquote, op, isOp, result, all=[];
  while (result = r_func.exec(ctx)) {
    pos = -1;
    isOp = false;
    switch (result[0]) {
      // is comment
      case '//': r_func.lastIndex = result.input.indexOf('\n', r_func.lastIndex)+1; break;
      case '/*': r_func.lastIndex = result.input.indexOf('*/', r_func.lastIndex)+2; break;

      // is string
      case "'" :
      case '"' :
        unquote = result[0];
        pos = r_func.lastIndex;

      default  :
        if (result[1] == '/') {
          // is RegExp or Div expression.
          pos = result.index;
          while (pos-- && r_spc.test(result.input.charAt(pos))) { }

          if (pos == -1) {  // out by zero, search to head
            isOp = true;
          }
          else {
            switch (result.input.charAt(pos)) {
              // operators of 'void', 'new', 'instanceof', 'in', 'typeof', 'delete'
              case 'n': if (pos>3) { op = result.input.substr(pos-3, 3); isOp = (/\bin/).test(op); } break;
              case 'w': if (pos>4) { op = result.input.substr(pos-4, 4); isOp = (/\bnew/).test(op); } break;
              case 'd': if (pos>5) { op = result.input.substr(pos-5, 5); isOp = (/\bvoid/).test(op); } break;
              case 'e': if (pos>7) { op = result.input.substr(pos-7, 7); isOp = (/\bdelete/).test(op); } break;
              case 'f': if (pos>7) { op = result.input.substr(pos-7, 7); isOp = (/\btypeof/).test(op); } 
                if (!isOp && (pos>11)) {
                  op = result.input.substr(pos-11, 11);
                  isOp = (/\binstanceof/).test(op);
                }
                break;
              default:
                // div express from [number, char, $] or a_function(). otherwise is
                // '(' or operators before regexp
                isOp = !r_div.test(result.input.charAt(pos));
            }
            pos = -1;
          }

          // is operators or begin of code block, so is regexp!
          if (!isOp) {
            r_func.lastIndex -= 1;
            break;
          }
          unquote = result[1];
          pos = r_func.lastIndex - 1;
        }

        // RegExp or String need pos to unquote
        if (pos > -1) {  // skip '\?'
          for (var ss=result.input, len=ss.length; pos<len; pos++) {
            switch (ss.charAt(pos)) {
              case '\\': pos++; continue;
              case unquote: r_func.lastIndex = pos+1; pos=len; break;
            }
          }
        }
        else switch (result[4]) { // find a keyword
          case 'while': case 'if': case 'switch': case 'for':
          case 'function': case 'return': case 'with': case 'catch':
          case 'new': case 'in': case 'instanceof': case 'delete': case 'void': case 'typeof':
          case 'Create':
          case 'get':
          case 'set':
          case 'inherited': break;
          default: all.push(result[3] + result[4]);
        }
    }
  }
  return all;
}


/**
 * reset debugger's output
 */
$debug = function() {
  arguments.join = Array.prototype.join;
  if (!('$cached$' in arguments.callee)) arguments.callee['$cached$'] = '';
  arguments.callee['$cached$'] += arguments.join('');
}

$debug.resetTo = function (func) {
  func($debug['$cached$']);
  func.resetTo = $debug['resetTo'];
  delete $debug['$cached$'];
  delete $debug['resetTo'];
  $debug = func;
}


/**
 * show profiler
 *  - need link style file(url: Framework/Debug/Profilers.Report.css) into your html document
 */
showProfiler = function ($prof, $print) {
  // code from JSEnhance.js
  var _r_strfmt = /%(.)/g;
  var _format = function() {
    var i=0, args=arguments, n=args.length;
    return (!n ? this : this.replace(_r_strfmt, function ($0,$1) {
      if (i==n) return $0;
      switch ($1) {
      case 's':
      case 'S': return args[i++];
      case '%': return $1;
      default : return (isNaN($1) ? $0 : args[$1]);
      }
    }));
  }
  function format(str, arr) {
    return _format.apply(str.toString(), arr);
  }
  
  // format time string.
  function timeStr(d) {
    return format('%s:%s:%s.%s', [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()]);
  }

  // filter invalid data if you want
  //  - for ff only.
  function dataFilter(n) {
    switch (n) {
      case 'get': case 'set': case 'inherited':  // compat(ff): for Qomo's Object
      case 'propertyIsEnumerable': case 'hasOwnProperty': case 'isPrototypeOf': // compat(ie5): for Object 
      case 'splice': case 'push': case 'pop': case 'shift': case 'unshift': // compat(ie5): for Array
      case 'ClassInfo': return false // compat(ff): for Qomo's Object
      default: return true;
    }
  }

  // arguments reset
  if (!$print) $print = $debug;

  // get data from profiler
  var data = $prof.toData();

  // header of table
  var lineFmt = format(format('<div class="%s">%1%1%1%1%1</div>', ['ln', '<span class="fd%s">%5</span>']), [1,2,3,4,5,'%s']);
  var headerFmt = lineFmt.replace(/class="(ln)"/g, 'id="prof_header" $&');
  var footerFmt = lineFmt.replace(/class="(ln)"/g, 'id="prof_footer" $&');
  $print('<div class="box">');
  $print(format(headerFmt, ['<span style="color: black">Title</span>', 'Time', 'Begin', 'End', 'Note']));

  // body of table
  var RowCount=0, Min=Number.MAX_VALUE, Max=0;
  for (var n in data) {
    if (!dataFilter(n)) continue;

    for (var i=0, len=data[n].length, err=!!(len%2); i<len; i+=2) {
      var t0=data[n][i], t1=data[n][i+1];
      if (err) t1 = data[n][len-1];

      RowCount++;
      Min = Math.min(Min, t0);
      Max = Math.max(Max, t1);
      $print(format(lineFmt, [
        n + (err ? '*' : len>2 ? '('+ (i/2+1) +')' : ''),
        (t1-t0)+'ms',
        data[n].length > 0 ? timeStr(new Date(t0)) : '', 
        data[n].length > 1 ? timeStr(new Date(t1)) : '',
        $prof(n).get('url')]));
      if (err) break;
    }
  }

  // footer of table
  var dataTag = RowCount > 0;
  RowCount = format('<span style="padding-left:60%">Total: %s</span>', [RowCount]);
  if (dataTag) {
    $print(format(footerFmt, [RowCount, (Max-Min)+'ms', timeStr(new Date(Min)), timeStr(new Date(Max)), '']));
  }
  else {
    $print(format(footerFmt, [RowCount, '0ms', '', '', '']));
  }
  $print('</div>');
}
//$import.setActiveUrl("Framework/RTL/Error.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.05.11]

Exception and Error Extend for Standard JavaScript
 - more info in Error() Object;
 - $assert()
*****************************************************************************/


var
  EAssertFail = [8001, 'assert is failed.\n\n%s'];


/**
 * rewrite Error() Class
 * - parament : -> number, description, object
 *           or -> array[number, description, ...], object
 */
void function () {
  var _RTLERROR = new Error(8000, 'Error in Qomo Core!');
  Error = function (v1, v2, v3) {
    var e, argn=arguments.length;

    if (v1 && v1.constructor===Array) {
      if (argn>1) v3 = v2;
      // v2 = String.format(v1[1], v1.slice(2));
      v2 = v1[1];
      v1 = v1[0];
    }

    e = new _RTLERROR.constructor(v1, v2);
    e.instanceObj = v3;
    return e;
  }
  Error.constructor = _RTLERROR.constructor;
}();


/**
 * Utility Functions $assert()
 */
$assert = function (isTrue, info) {
  if (!isTrue) throw new Error(EAssertFail.concat([info]));
}
//$import.setActiveUrl("Framework/RTL/Protocol.js");
/*****************************************************************************
Qomolangma OpenProject v1.0 - protocol layer
  [Aimingoo(aim@263.net)]
  [2006.02.24]

 - common protocol analyze and description
*****************************************************************************/

/**
 * Url Object
 * protocol types : [HKEY_CLASSES_ROOT\PROTOCOLS\Handler]
 */
Url = function() {
  // type://<name>:<pass>@<host>:<port>/<path>?<param>
  var _r_url = /^(\w+)(:\/*)([^\/]*)(\/[A-Za-z]:\/)?/;
  var _r_query = /\..+\/(.+)$/;

  function _parse(url) {
    var r, i, j, s, tmp, o=this;
    o.URL = url;
    o.type = '';
    if (!(r = _r_url.exec(url))) return o;

    // protocol char count, alias $0
    i = r[0].length;
    o.type = r[1];
    o.host = r[3];
    o.port = '';

    // port and auth analyzer. some protocol without port setting, and default 80.
    if (r[2] == '://') {
      o.port = '80';

      s = o.host;
      if ((j=s.indexOf('@')) != -1) {
        o.host = s.substr(j+1);
        s = o.name = s.substr(0,j)
        if ((j=s.indexOf(':')) != -1) {
          o.name = s.substr(0,j);
          o.pass = s.substr(j+1);
        }
      }

      s = o.host;
      if ((j=s.lastIndexOf(':')) != -1) {
        o.host = s.substr(0,j);
        o.port = s.substr(j+1);
      }

      // for opera localhost protocol.
      if (r[4]) {
       i--;
       o.host += r[4].substr(0, r[4].length-1);
      }
    }

    if (i == url.length) return o;

    o.path = url.substr(i+1);// ScriptName = '/' + o.path
    o.param = o.query = '';  // QueryString, PathInfo
    o.params = {};           // QueryFields
    s = o.path;
    if ((j=s.indexOf('?')) != -1) {
      o.path = s.substr(0,j);
      o.param = s.substr(j+1);

      // query param analyzer. some field value is NullString.
      var p, n, v, arr = o.param.split('&');
      for (i=0; i<arr.length; i++) {
        p = arr[i].indexOf('=');
        n = (p != -1)?arr[i].substr(0,p) : arr[i];
        v = (p != -1)?arr[i].substr(p+1) : '';
        o.params[n] = v;
      }

      // get query path
      s = o.path;
      if (s.search(_r_query) != -1) {
        o.query = r[1];
        o.path = s.substr(0, s.length-o.query.length-1);
      }
    }
    return o;
  }

  function _url(url) {
    if (url) this.parse(url);
  }
  _url.parse = _parse;
  _url.prototype.parse = _parse;

  _parse.toString = $QomoCoreFunction('Url.parse');
  _url.toString = $QomoCoreFunction('Url');
  return _url;
}();
//$import.setActiveUrl("Framework/Compat/CompatLayer.js");
/*****************************************************************************
Qomo Project v1.0 - compatible layer
  [Zhe(fangzhe@msn.com), Aimingoo(aim@263.net)]
  [2006.02.24]

 routeline:
 - first detect browser family by navigator.userAgent
 - for IE, using the Conditional Compile feature for script engine version detection,
   see http://msdn2.microsoft.com/en-us/library/121hztk3.aspx
 - for Gecko, detect render engine version directly since script engine is embeded.
 - for WebKit, same as Gecko since JavaScriptCore is undetectable.
 - load a JavaScript compatible layer for specified browser/script engine, let
   them behave as if they are the same, at least to other Qomo components.
 - (TODO:) load a W3C DOM/CSS compatible layer for specified browser/render engine.

 btw, by embeding the file into where it has been called by $import() and removing
      codes setting attributes, the compatible framework should work independently.

 documents about browser detect
   - http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html
   - http://www.mozilla.org/build/revised-user-agent-strings.html
 object sniphing, another way
   - http://www.webreference.com/programming/javascript/sniffing/
   - http://www.andrewdupont.net/2007/04/04/browser-sniffing/
 "IE7", a standards-compliant script library for IE
   - http://dean.edwards.name/IE7/
 *****************************************************************************/

void function() {
  function ver_compare(v1, v2) {
    var r_rev = /\D*\.0*/;
    var a1 = v1.split(r_rev), a2 = v2.split(r_rev);
    var len = Math.min(a1.length, a2.length);
    for (var i = 0; i < len; i ++) {
      if (a1[i] != a2[i]) return (a1[i] - a2[i] > 0 ? 1 : -1)
    }

    if (a1.length == a2.length) return 0;
    return (a2.length == len ? 1 : -1)
  }

  /**
   * Note: it is necessary to detect Opera first because there's "MSIE" in its UA string
   * as the same, WebKit has "Gecko" in its UA string ...
   *
   */
  $import.set('browser', function() {
    var agt = navigator.userAgent,
    is_opera = (agt.indexOf("Opera") != -1), // !!window.opera,
    is_msie = (agt.indexOf("MSIE") != -1) && !is_opera,
    is_webkit = (agt.indexOf("AppleWebKit") != -1),
    is_gecko = (agt.indexOf("Gecko") != -1) && !is_webkit,
    r_gecko = /rv:([\d|\+.]+)/, // match the ... rv: version in Gecko family browsers
    checker = {
      msie : is_msie,
      moz : is_gecko && r_gecko.exec(agt) && ver_compare(RegExp.$1, '1.8') >= 0,
      mozold : is_gecko && !this.moz,
      opera : is_opera,
      safari : is_webkit
    };

    for (var i in checker) {
      if (checker[i]) return i;
    }

    // if nothing matched
    return 'other';
  }());
/* context imported... */

}();
//$import.setActiveUrl("Framework/RTL/CompatInline.js");
/**
 * this is my test for new compat layer
 * code context parse by Building.js
 */

switch ($import.get('browser')) {
  case 'msie'    : {
/*
 Temporary, need to be cleaned.
*/

// delete some by aimingoo
// include('q3.js');
    
    break;
  }
  case 'mozold'  : {
//$debug('fail: Sorry, Qomo runs only on Geckco engine 1.8 or above.');

void function() {
  // for very old version... :)
}();
/* removed: 'common_moz.js' */
    /* with next */
  }
  case 'moz' : {
// mozilla compatible environment

// enable priviledge and try callback, valid in this context only.
//  - if invalid, throw a exception.
applyPriviledge = function(priviledge, callback) {
  try {
    netscape.security.PrivilegeManager.enablePrivilege(priviledge);
  }
  catch (ex) { /* eat it */ }

  callback();
}

// for RegExp Object
void function() {
  var _exec = RegExp.prototype.exec;

  RegExp.prototype.exec = function (str) {
    var arr = _exec.call(this, str);
    RegExp.index = arr ? arr.index : 0;
    RegExp.lastIndex = this.lastIndex;

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

  var _Ajax = Ajax;

  Ajax = function() {
    var ajx = new _Ajax();
    var open = ajx.open;

    ajx.open = function() {
      try{
        open.apply(this, arguments)
      }
      catch (e) {
        var ajx = this, args = arguments;
        applyPriviledge('UniversalBrowserRead', function() {
          open.apply(ajx, args);
        });
      }
    }

    return ajx;
  }
}();
    break;
  }
  case 'opera'  : {
/** bug in safari v3
 *   - none Function.caller
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
/**
 *  JavaScript 1.6 compat for IE 6 & Moz
 *
 *  - Array extras
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
 *  JavaScript 1.6 compat for IE 6 & Moz
 *
 *  - String extras
 */
if (!String.prototype.quote) {
  String.prototype.quote = function () {
    return '"' + this.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + '"';
  }
}

/**
 *  JavaScript 1.6 compat for IE 6 & Moz
 *
 *  - generic extras
 *  - you can copy code from js16generics.js by Erik Arvidsson.
 */
    break;
  }
  case 'safari'  : {
/** bug in safari v3
 *   - global variant lost in eval_code_block
 * note: aimingoo
 */

// Safari support is experimental due to the same global variable content
// handling bug as Mozilla in Safari, and
// lack of Function.caller which currently supported in branch rev. 17483
// or newver: see http://bugs.webkit.org/show_bug.cgi?id=4166

// for RegExp Object
void function() {
/* is no need for safari 3.0
  var _exec = RegExp.prototype.exec;
  
  RegExp.prototype.exec = function (str) {
    var arr = _exec.call(this, str);
    var r = RegExp;

    r["$_"] = r.input = str;
    r["$&"] = r.lastMatch = (!arr ? '' : arr[0]);
    r["$+"] = r.lastParen;
    r["$`"] = r.leftContext =  (!arr ? '' : str.substr(0, arr.index));
    r["$'"] = r.rightContext =  str.substr(this.lastIndex-1); 

    r.index =  (!arr ? 0 : arr.index);
    r.lastIndex =  this.lastIndex;

    for (var i=0; "" != (r.lastParen = r["$"+i]); i++);

    return arr;
  }
  
  String.prototype.search = function (r){
    r.lastIndex = 0;
    return (r.exec(this) ? RegExp.index : -1);
  }
*/
  var $import_setter = $import.set;
  $import.setActiveUrl = function(url) {
    $import_setter('curScript', url);
  }
}();

window.execScript = function(script, type) {
  var r_func = /^function\s+([^ \s\(]+)\s*\(/gm;
/* bug in safari 3.0 beta3, and must fix common\pool.js
  var scr='',j=0,
  arscr=script.split('var');
  for (var i=0; i<arscr.length; i++) {
    j+=arscr[i].split('{').length;
    j-=arscr[i].split('}').length;
    if (j!=0 && i!=0) scr+='var';
    scr+=arscr[i];
  }
  scr = scr.replace(r_func, '$1 = function (');
*/
  var scr = script.replace(r_func, '$1 = function (');
  window.eval(scr, type);
}
    break;
  }
}
//$import.setActiveUrl("Framework/RTL/Interface.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.28]

 - Interface Register
 - Interface Query
 - Aggregated Interface
 - Some base interfaces defined
 - Abstract method
*****************************************************************************/

var
  EQueryObjectInvalid = [8081, 'Can\'t query interface with Null object or undefined value.'];
  EInterfaceNotExist = [8082, 'Query interface is not exist.'];
  ECallAbstract = [8083, 'Call Abstract Method.'];

/**
 * Abstract method for interfaces
 */
Abstract = function() {
  throw new Error(ECallAbstract)
}

/**
 * system defined interfaces
 */
IImport = function() { /* ... */ }
IMuEvent = function() { /* ... */ }

// Collection or named Enumerator
INamedEnumer = function() {
  this.getLength =
  this.items =
  this.names = Abstract;
}

// for Aspect's JoPoint
IJoPoint = function() {
  this.assign =
  this.unassign = Abstract;
}

// for JoPoint's Collection
IJoPoints = function() {
  INamedEnumer.call(this);
}

// for TMyObject(), etc.
IClass = function() {
  this.hasAttribute =
  this.hasOwnAttribute = Abstract;
}

// for Custom Attribute provide object
IAttrProvider = function() {
  this.hasAttribute =
  this.hasOwnAttribute = Abstract;
}

// for Attribute's Collection
IAttributes = function() {
  INamedEnumer.call(this);
}

// for instance by TMyObject, etc.
IObject = function() {
  IAttrProvider.call(this);

  this.hasEvent =
  this.hasProperty =
  this.hasOwnProperty = Abstract;
/* can't detect:
   this.hasOwnEvent = Abstract; */
}

IInterface = function() {
  this.QueryInterface = Abstract;
}

// for Class() function
IClassRegister = function() {
  this.hasClass = Abstract;
}

// for TAspect and all sub-classes
IAspect = function() {
  this.supported =
  this.assign =
  this.unassign =
  this.merge =
  this.unmerge =
  this.combine =
  this.uncombine =
  this.OnIntroduction =
  this.OnBefore =
  this.OnAfter =
  this.OnAround = Abstract;
}

// (inherted or united) define interfaces
IAspectedClass = function() {
  IClass.call(this);
  IJoPoints.call(this);
}


/**
 * Interface keyword
 *
 * Register interface for Class types
 *   Class(Parent, Name, Interfaces);
 * Register Interface for functions or Object's instances
 *   Interface(obj, Interfaces);
 *   RegisterInterface(obj, Interfaces);
 *   Interface.RegisterInterface(obj, Interfaces);
 */
// Aspect = NullFunction;
Interface = function() {
  var handle = '_INTFHANDLE_';
  var $Intfs = { length:0 };
  var $Aggrs = [];
  var $Aggri = [];

  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i=0, len=this.length; i<len; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }

  function getAggrInterfaces(func) {
    var i = indexOf.apply($Aggrs, arguments);
    if (i>-1) return $Aggri[i];
  }

  function warpInterface(intf) {
    var h = intf[handle];
    if ((h===undefined) || !$Intfs[h] || $Intfs[h][0]!==intf) {
      h = intf[handle] = $Intfs.length++;
      $Intfs[h] = [intf];
    }
    return $Intfs[h];
  }
  warpInterface(IInterface);
  warpInterface(IJoPoint);
  warpInterface(IMuEvent);
  warpInterface(IJoPoints);

  function isInterface(intf) {
    if (intf instanceof Function) {
      var h = intf[handle];
      return (h!==undefined && $Intfs[h] && $Intfs[h][0]===intf);
    }
    return false;
  }

  // IInterface implemented by anything, other for Qomo's class only
  function isImplemented(intf) {
    switch (intf) {
      case IInterface: return true;
      case IJoPoint:   return this instanceof JoPoint;
      case IMuEvent:   return this instanceof MuEvent;
    }

    var cls = this.ClassInfo;  // 'this' is Class or Instance
    while (cls) {
      if (indexOf.apply($Intfs[intf[handle]], [cls]) > -1) return true;
      cls = cls.ClassParent;
    }
    return false;
  }

  function _Interface(obj) { /* Intf1 .. Intfn */
    if (obj===undefined || obj===null) return -1;

    // warp interfaces, and assign to obj
    for (var i=1,args=arguments,argn=args.length; i<argn; i++) {
      var all = warpInterface(args[i]);  // all[0] equ intf
      if (indexOf.apply(all, [obj]) == -1) all.push(obj);
    }

    // register aggregated interfacds. is special!
    if (obj instanceof Function) {
      if (_Interface.caller===Aggregate && this!==Aggregate) {
        var i = indexOf.apply($Aggrs, [obj]);
        if (i == -1) {
          $Aggrs.push(obj);
          $Aggri.push(this);
          return this;
        }
        // else, merge interfaces
        for (var n in this) {
          if (this.hasOwnProperty(n) && !$Aggri[i].hasOwnProperty(n)) $Aggri[i][n] = this[n];
        }
        return $Aggri[i];
      }
    }

    // now, if you want, you can recheck instance's interface
  }


  _Interface.QueryInterface = function(obj, intf) {
    // 1. check arguments
    if (obj===undefined || obj===null) throw new Error(EQueryObjectInvalid);
    if (!isInterface(intf)) throw new Error(EInterfaceNotExist);

    // 2. for Qomo's Object, try get interface from Class or Parent Class.
    if (!isImplemented.call(obj, intf)) {
      // 3. if Aggregated, then GetInterface and return it
      var intfs, foo = (obj instanceof Function ? obj : obj.constructor);
      return ((intfs=getAggrInterfaces(foo)) ? intfs.GetInterface(obj, intf) : void null);
    }

    // 4. return a implemented interface for Object's Registed Interfaces, or A IInterface impl.
    var p=obj, f=new intf();
    if (intf===IInterface) {
      f.QueryInterface = function(intf) { return Interface.QueryInterface(p, intf) }
    }
    else {
      var slot = ['f["', , '"]=function(){return p["', ,'"].apply(p, arguments)}'];
      for (var i in f) {
        slot[1] = slot[3] = i;
        eval(slot.join(''));
      }
    }
    return f;
  }

  _Interface.RegisterInterface =_Interface;
  _Interface.IsInterface = isInterface;

  return _Interface;
}();
RegisterInterface = Interface.RegisterInterface;


/**
 * Interface Query
 *
 * AIntf = QueryInterface(obj, intf);
 */
QueryInterface = Interface.QueryInterface;


/**
 * Aggregated Interface register (Utility function)
 *
 * Intfs = Aggregate(obj, Interfaces);
 */
Aggregate = function() {
  var handle = '_INTFHANDLE_';

  function Interfaces(args) {
    for (var i=1; i<args.length; i++) {
      this[args[i][handle]] = new args[i];
    }
  }
  Interfaces.prototype.GetInterface = function(intf) { /* or (obj, intf) */
    if (arguments.length==1) return this[intf[handle]];

    var _intf=arguments[1];
    if (_intf) {
      var ff, p=arguments[0], f=new _intf();
      if (_intf === IInterface) {
        f.QueryInterface = function(intf) { return Interface.QueryInterface(p, intf) }
      }
      else {
        if (!(ff=this[_intf[handle]])) return;
        var slot = ['f["', , '"]=function(){return ff["', ,'"].apply(p, arguments)}'];
        for (var i in f) {
          slot[1] = slot[3] = i;
          eval(slot.join(''));
        }
      }
      return f;
    }
  }

  // interface aggregation.
  // ( !!! special: call Interface.RegisterInterface() )
  function _Aggregate(foo) { /* Intf1 .. Intfn */
    if (foo instanceof Function) {
      Interface.RegisterInterface.apply(_Aggregate, arguments);
      return Interface.RegisterInterface.call(new Interfaces(arguments), foo);
    }
  }
  return _Aggregate;
}();
//$import.setActiveUrl("Framework/RTL/JoPoints.js");
/**
 * Utility Class JoPoint(), JoPoints()
 * - join point for AOP.
 */

JoPoint = function() {
  function _JoPoint () {
    this.items = []; // push implemented name.
    this.all = {};   // push implemented IAspect.
  }

  _JoPoint.prototype.assign = function(n, a) {
    if (!this.all[n]) this.items.push(n);
    this.all[n] = Interface.QueryInterface(a, IAspect);
  }

  _JoPoint.prototype.unassign = function(n) {
    this.items.remove(n);
    delete this.all[n];
  }

  return _JoPoint;
}();


JoPoints = function() {
  function _JoPoints () {
    for (var i=0; i<arguments.length; i++, this.length++) this[(this[i]=arguments[i])] = new JoPoint();
  }
  _JoPoints.prototype.length = 0;
  _JoPoints.prototype.pt = function(n) { return (this.hasOwnProperty(n) ? this[n] : undefined) }
  _JoPoints.prototype.add = function(n) { this[(this[this.length++]=n)] = new JoPoint() }
  _JoPoints.prototype.items = function(i) {
    var pt = ((typeof i=='number' || i instanceof Number) ? this[this[i]] : this.pt(i));
    return (!pt ? new IJoPoint() : Interface.QueryInterface(pt, IJoPoint));
  }

  _JoPoints.prototype.weaving = function(n, f) {
    var $n=n, $f=f, $pts=this;
    return function() {
      var $pt=$pts.pt($n);
      if (!$pt || ($pt.items.length==0)) return $f.apply(this, arguments);

      var names=$pt.items, imax=names.length, point=$n;
      var _value, _intro=true, _cancel=false;

      for (var i=0; _intro && i<imax; i++) _intro = ($pt.all[names[i]].OnIntroduction(this, names[i], point, arguments) !== false);
      if (_intro) for (var i=0; i<imax; i++) $pt.all[names[i]].OnBefore(this, names[i], point, arguments);
      if (_intro) for (var i=0; !_cancel && i<imax; i++) _cancel = ($pt.all[names[i]].OnAround(this, names[i], point, arguments) === false);
      if (!_cancel) _value = $f.apply(this, arguments);
      if (_intro) for (var i=0; i<imax; i++) $pt.all[names[i]].OnAfter(this, names[i], point, arguments, _value);
      return _value;
    }
  }

  return _JoPoints;
}();
//$import.setActiveUrl("Framework/Names/NamedSystem.js");
/*****************************************************************************
Qomolangma OpenProject v1.0 - Named System Model
  [Aimingoo(aim@263.net)]
  [2006.02.13]

 - Url Object
 - re-description of $import()
 - Namesystem support: $map(), $mapx(), $n2p(), $p2n() functions
 - Alias system support
*****************************************************************************/


/**
/* Qomo core namespace and alias system init.
 */
/* context imported... */

//and more...
//$import.setActiveUrl("Framework/Names/Namespace.js");
/**
 * namespace sub system
 *
 * function: $map(), $n2p, $p2n, $mapx
 *  - P2N   : searh in $map$ privated object.
 *  - N2P   : NameSpace.constructor
 *  - N2Str : NameSpace.toString()
 *  - Str2N : eval(Str)
 * if namespace constructor property eq '', then it's virtual
 */
function isNamespace(n) {
  if (n === null) return false;
  if (typeof n != 'object') return false;
  switch (typeof n.constructor){
   case 'function': return false; // is a normal object
   case 'object': {
     if (isNamespace(n.constructor)) return true;  // a alias
     return n.constructor.constructor == String;   // constructor is a String Object
   }
   case 'string': return true;
   default: return false;
  }
}

$map = function() {
  // get reference from $import
  var $getter = $import.get;
  var parseRelativeURL = $getter('parseRelativeURL');
  var transitionUrl = $getter('transitionUrl');
  var scripts = $getter('scripts');
  var activeJS = $getter('activeJS');
  var docBase = $getter('docBase');
  var $third = 'Qomo.Thirdparty';

  function curScript() {
    return $getter('curScript');
  }

  function pathBase() {
    return $getter('pathBase')();
  }

  // $import enhanced, call activeSpc() to get current active namesapce
  $import.set('activeSpc', function() {
    var s = curScript() || activeJS();
    if (s) {
      s = s.substr(0, s.lastIndexOf('/')+1);
      s = $p2n((s.charAt(0)=='/' ? '' : docBase) + s); 
      if (s) return s;
    }
    // throw new Error([2, 'Can\'t Get Active Namespace!']);
    return $third;
  });


  // $import enhanced, support import package by name and alias.
  $import.set('transitionUrl', function(target){
    if (isNamespace(target)) {
      var p = $n2p(target), url = p + 'package.xml';
      scripts[url] = null;  // set cached tag

      // todo: analize package.xml context, and call $import();
      // var str = httpGet(url);
      // ...
    }

    return transitionUrl(target);
  });

  // return a function provide to a NameSpace.toString()
  function $name(name) {
    return new Function("return '" + name + "'");
  }

  // a hashed map table by path.length
  var $map$ = {
    //mapper of all path
    //0..n : dynamic properties with this.insert()

    // find a signpost in map for the p(ath)
    signpost : function(p) {
      var i, imax, sp, n=p.length;
      while (n>1) {
        if (sp=this[n]) {
          for (i=0, imax=sp.paths.length; i<imax; i++)
            if (sp.paths[i]==p) return sp.names[i];
        }
        p = p.substr(0, p.lastIndexOf('/', n-2)+1);
        n = p.length;
      }
      return null;
    },

    // remove a (n)amespace
    remove : function(p) {
      var sp;
      if (sp = this[p.length]) {
        for (var i=0, imax=sp.paths.length; i<imax; i++) {
          if (sp.paths[i] == p) {
            // if you want, you can reset n(ame) from map :
            // while (isAlias(n)) n=n.constructor;
            // sp.names[i] = p;
            //searched, remove and return.
            sp.names.splice(i,1);
            sp.paths.splice(i,1);
            return true;
          }
        }
      }
      return false;
    },

    // insert p(ath) to map
    insert : function(p, n) {
      if ($p2n(p)==null) {
        if (sp=this[p.length]) {
          sp.names.push(n);
          sp.paths.push(p);
        }
        else {
          this[p.length] = {names:new Array(n), paths: new Array(p)};
        }
      }
    }
  };

  // get path from a namespace, if namespace is virtual, return ''
  // ( support alias system )
  function $n2p(n) {
    if (n) {
      while (n.constructor.constructor != String) n = n.constructor;
      return n.constructor;
    }
  }

  // get namespce with a path, if namespace no exist, return null
  // * notice: calc with sp.toString()
  function $p2n(p) {
    // for relative_path root only
    if (p=='' && $n2p(Qomo)=='') return Qomo;

    var sp = $map$.signpost(p);
    if (!sp) return null;
    if (sp.constructor==p) return sp;

    var n = p.substring(sp.constructor.length, p.length-1).replace('/', '.');
    try {
      return eval(sp + '.' + n);
    }
    catch (e) {
      return null;
    }
  }

  // expand a string to a full Namespace.  (s)tring arugment begin with a 
  // valid namespace(none virtual), and end by a sub_path of namespace.
  // $mapx() will fill(/expand) with sub_path.
  function $mapx(s) {
    var n, i, p='', $spc='', $ss=s.split('.')
    for (i=0; i<$ss.length; i++,$spc+='.') {
      $spc += $ss[i];
      if (n=eval($spc)) {
        p = n.constructor;
        continue;
      }
      while (true) {
        window.execScript($spc+'={};', 'JavaScript');
        p += $ss[i] + '/';
        n = eval($spc);
        n.constructor = p;
        n.toString = $name($spc);
        if (++i >= $ss.length) break;
        $spc += '.'+$ss[i];
      }
    }
  }

  var $attr$ = {
    '$n2p' : $n2p,
    '$p2n' : $p2n,
    '$mapx' : $mapx
  }

  function _map(name, path, base) {
    if (path) {
      path = parseRelativeURL((path.charAt(0)=='/' ? '' : base || pathBase()) + path);
    }

    if (isNamespace(name)) { // mapped ?
      /* warning: if path cached and name expanded, then system may crash!!! */
      if ($map$.remove($n2p(name))) { };
    }
    else {
      var $ss = name.split('.');
      if ($ss.length==0) return;

      var $spc = $ss[0];
      try {
      	// if none root space, then throw error
        eval($spc);
      }
      catch (e) {
        // make root space
        window.execScript($spc+'={};', 'JavaScript');
        eval($spc).constructor = "";
        eval($spc).toString = $name($spc);
      }

      for (var i=1,imax=$ss.length; i<imax; i++) {
        $spc += '.'+$ss[i];
        if (eval($spc)) continue;

        while (true) {
          window.execScript($spc+'={};', 'JavaScript');
          eval($spc).constructor = "";
          eval($spc).toString = $name($spc);
          if (++i >= $ss.length) break;
          $spc += '.'+$ss[i];
        }
      }
    }

    name = eval(name);
    name.constructor = path;
    if (path) $map$.insert(path, name);
  }

  _map.get = function(n) {
    return eval('$attr$[n]');
  }

  _map.set = function(n, v) {
    return eval('$attr$[n] = v');
  }

  _map.OnSysInitialized = function() {
     delete _map.set;
     delete _map.get;
     delete _map.OnSysInitialized;
  }

  // Qomo.Thirdparty is exist always, and can't rewrite it.
  _map($third, '');
  $third = eval($third);

  return _map;
}();

$n2p = $map.get('$n2p');
$p2n = $map.get('$p2n');
$mapx = $map.get('$mapx');
$map.OnSysInitialized();
//$import.setActiveUrl("Framework/Names/Alias.js");
/**
 * alias sub system
 * ( other way: variant's define and reference to implement alias system )
 */
function isAlias(n) {
  return isNamespace(n.constructor);
}

function $alias(alias, name) {
  $map(alias, '');
  eval(alias).constructor = name;
}
//$import.setActiveUrl("Framework/Names/Qomo.spc");
/** 
 * register Qomo's Spaces
 *   - current is $(QomoRoot)/Framework/Names/
 *   - (if you want,) base current: $map('Qomo', '../../');
 * next for Qomo's path root only:
 *   ''  : is root, with relative_path
 *   '/' : is root, with absolute_path, and qomo.js in web site's root.
 */
$map('Qomo', './', function() {
  return $import.get('docBase') + $import.get('srcBase');
}());

$map('Qomo.System', 'Framework/', $n2p(Qomo));
$mapx('Qomo.System.Common');
$mapx('Qomo.System.RTL');

$map('Qomo.UI', 'Components/', $n2p(Qomo));
$mapx('Qomo.UI.Graphics');
$mapx('Qomo.UI.Controls');

$map('Qomo.DB', '');
$map('Qomo.DB.LocalDB', 'Components/LocalDB/', $n2p(Qomo));
//$import.setActiveUrl("Framework/Names/Qomo.alias");
// a alias for RTL
$alias('Qomo.RTL', Qomo.System.RTL);
//$import.setActiveUrl("Framework/RTL/JSEnhance.js");
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
void function() {
  var _r_strfmt = /%(.)/g;
  var _replace = String.prototype.replace;

  String.prototype.format = function() {
    var i=0, args=arguments, n=args.length;
    return (!n ? this : this.replace(_r_strfmt, function ($0,$1) {
      if (i==n) return $0;
      switch ($1) {
      case 's':
      case 'S': return args[i++];
      case '%': return $1;
      default : return (isNaN($1) ? $0 : args[$1]);
      }
    }));
  }
  String.format = function(s, arr) {
    return String.prototype.format.apply(s.toString(), arr);
  }

  // rgExp is string or regexp, call prototype.
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

  String.prototype.replace = function(rgExp, replaceText) { /* lastIndex */
    return (rgExp instanceof Array ? _removeBlock : _replace).apply(this, arguments);
  }
  String.prototype.endsWith = function(suffix) {
    return (this.substr(this.length - suffix.length) == suffix);
  }
  String.prototype.startsWith = function(prefix) {
    return (this.substr(0, prefix.length) == prefix);
  }
  String.prototype.trimLeft = function() {
    return this.replace(/^\s*/, "");
  }
  String.prototype.trimRight = function() {
    return this.replace(/\s*$/, "");
  }
  String.prototype.trim = function() {
    return this.trimRight().trimLeft();
  }
}();
format = String.format;


/**
 * base object system extend - Number
 */
Number.prototype.toString = function() {
  var _toString = Number.prototype.toString;

  return function(radix, length) {
    var result = _toString.apply(this, arguments).toUpperCase();
    var length = length || 0;
    return (result.length>=length ? result
      : (new Array(length - result.length)).concat(result).join('0')
    );
  }
}();

/**
 * base object system extend - Function
 */
void function(){
  // reference of Function's toString()
  var _f_toString = Function.prototype.toString;
  // get name and params from Function's toString()
  var _r_function = /^function\b *([$\w\u00FF-\uFFFF]*) *\(/;

  // always anonymous function string
  Function.prototype.toString = function () {
    return _f_toString.call(this).replace(_r_function, 'function (');
  }
}();


/**
 * base object system extend - Error
 */
void function() {
  var _Error = Error;
  Error = function(v1, v2) {
    return (!(v1 && v1.constructor===Array) ? new _Error(v1, v2)
      : new _Error(v1[0], String.format(v1[1], v1.slice(2)), v2));
  }
}();


/**
 * mutil cast event
 */
MuEvent = function() {
  var hidden = $QomoCoreFunction('MuEvent');
  var funcs = ['add', 'addMethod', 'clear', 'reset', 'close'];
  var GetHandle = {};

  var all = {
    length : 0,
    search : function(ME) {
      var i = ME(GetHandle), me = all[i];
      if (me && me['event']===ME) return me;
    }
  }

  function add(foo) {
    var e = all.search(this);
    if (e) e[e.length++] = {action: foo, sender: undefined}
  }

  function addMethod(obj, foo) {
    var e = all.search(this);
    if (e) e[e.length++] = {action: foo, sender: obj}
  }

  function clear() {
    var e = all.search(this);
    if (e) while (e.length>0) delete e[--e.length];
  }

  function reset(foo) {
    var e = all.search(this);
    if (e) {
      e.length = 1;
      e[0] = {action: foo, sender: undefined};
    }
  }

  function close() {
    var e = all.search(this);
    if (e) {
      for (var i=0; i<funcs.length; i++) delete this[funcs[i]];
      delete e.event;
    }
  }

  function run(handle, args) {
    for (var v, v2, i=0, e=all[handle], len=e.length; i<len ; i++) {
      if ((v2 = e[i].action.apply((e[i].sender ? e[i].sender : this), args)) !== undefined) {
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
      if ($E===GetHandle) return handle;
      if (all[handle].length > 0) return run.call(this, handle, arguments)
    }
    ME.constructor = _MuEvent;
    ME.toString = hidden;

    // "this" is the new obj instance
    this.event = ME;
    all[handle] = this;

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
  return _MuEvent;
}();

/**
 * Some utility function for Array each.
 * - clone el
 */
$ArrayFrom = function(e, i, a) {
  a[i] = this[i];
}
$import.setActiveUrl("Framework/RTL/Object.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.28]

 - class register:   TMyObject = Class(TObject, 'MyObject);
 - class construct:  obj1 = TMyObject.Create();
 - object construct: obj2 = new MyObject();
 - attribute getter/sett: _get(), _set(), Attribute(), obj.get(), obj.set()
 - (in mehtod only, )inherited method call: this.inherited()
*****************************************************************************/

var
  ECallClassBadArguments = [8101, 'Arguments error  for Class().'];
  ERegClassNoname = [8102, 'With call Class(), lost class name .'];
  EAccessSafeArea = [8104, 'Try Access Safe area.'];
  EInvalidProtectArea = [8105, 'Protect area invalid.'];
  EInvalidInheritedContext = [8106, 'this.Inherited() need call in method.'];
  EInvalidInherited = [8107, 'Inherited method name invalid or none inherited.'];
  EAccessSecurityRules = [8108, 'Access security rules!'];
  EAccessInvaildClass = [8109, 'Class invaild: lost typeinfo!'];
  EWriteUndefinedAttr = [8110, 'Try write undefined attribute!'];
  EInvalidClass = [8111, 'Class or ClassName Invalid.'];
  ECreateInstanceFail = [8112, 'Create Instance fail.'];
  EAttributeCantRead = [8112, 'The "%s" attribute can\'t read for %s.'];
  EAttributeCantWrite = [8112, 'The "%s" attribute can\'t write for %s.'];

var
  _r_event = /^On.+/;
  _r_attribute = /^([gs]et)(.+)/;

/**
 * Utility Functions Attribute()
 * - quick register attribute and init.
 */
Attribute = function() {
  function hasMethod(obj, p) {
    if (typeof p != 'function') return false;
    switch (p.caller) { case obj.get: case obj.set: return true }
    switch (p) { case obj.Create: case obj.get: case obj.set: case obj.inherited: return true }
    for (var n in obj) if (obj[n]===p) return true;
  }
  function cantRead(n) { throw new Error(EAttributeCantRead.concat([n, this.ClassInfo.ClassName])) }
  function cantWrite(n) { throw new Error(EAttributeCantWrite.concat([n, this.ClassInfo.ClassName])) }
  function p_getAttr(n) {
    if (!hasMethod(this, p_getAttr.caller.caller))
      throw new Error(EAttributeCantRead.concat([n, this.ClassInfo.ClassName]));
    return this.get();
  }
  function p_setAttr(v, n) { 
    if (!hasMethod(this, p_setAttr.caller.caller))
      throw new Error(EAttributeCantWrite.concat([n, this.ClassInfo.ClassName]));
    this.set(v);
  }
/*
  function cloneAttr(value) {
    // clone, and write to attributes of the instance;
    var _v = value;
    return function(n) {
      if (_v === this.get()) this.set(eval('(' + uneval(_v) + ')'));
      return this.get();
    }
  }

  // ...
  if (tag.indexOf('c') > -1) base['get'+name] = cloneAttr(value);
*/
  var tag_clone={};
  return function(base, name, value, tag) {
    var i, argn = arguments.length;
    var Constructor = Attribute.caller;
    var cls = Constructor.caller;
    if (argn>3) {
      tag = tag.toLowerCase();
      if ((tag.indexOf('p') > -1)) {
        base['get'+name] = p_getAttr;
        base['set'+name] = p_setAttr;
      }
      else {
        base['get'+name] = cantRead;
        base['set'+name] = cantWrite;
      }
      for (var i=0; i<tag.length; i++) {
        switch (tag.charAt(i)) {
          case 'r': delete base['get'+name]; break;
          case 'w': delete base['set'+name]; break;
        }
      }
      if (tag.indexOf('c') > -1) base['get'+name] = tag_clone;
    }

    return (cls && cls.set && cls.set(name, value));
  }
}();


/**
 * keyword, and class register function: Class()
 */
Class = function() {
  // all real Constructor()'s instance for Class
  var _classinfo_ = { };
  var _undefined_ = { };
  var $getter_str = $QomoCoreFunction('Attribute.get');
  var $setter_str = $QomoCoreFunction('Attribute.set');
  var $inherited_str = $QomoCoreFunction('inherited');
  var $inherited_invalid = function() { throw new Error(EInvalidInherited) };

  var $cc_attr = {
    r: "_proto_['get'+n]!==$cc_attr.getInvalid",
    w: "_proto_['set'+n]!==$cc_attr.setInvalid",
    c: "_proto_['get'+n]===$cc_attr.getClone",
    p: "_proto_['get'+n]===$cc_attr.getProtect || _proto_['set'+n]===$cc_attr.setProtect",
    '*': "_proto_['get'+n]!==$cc_attr.getInvalid && _proto_['set'+n]!==$cc_attr.setInvalid",
    'undefined': "true"
  };
  Attribute($cc_attr, 'Invalid', '', '');  // fake and get method_ptr: cantRead(), cantWrite()
  Attribute($cc_attr, 'Protect', '', 'p'); // fake and get method_ptr: p_getAttr(), p_setAttr()
  Attribute($cc_attr, 'Clone', '', 'c');   // fake and get tag_clone

  var _joinpoints_ = new JoPoints();
  _joinpoints_.add('Initializtion');
  _joinpoints_.add('Initialized');

  // class's type info
  // - need not support namespace
  function ClassTypeinfo(cls, diff, Attr) {
    this.class_ = cls;
    this.$Attr_ = Attr;
    this.$diff_ = diff;
    this.next__ = _classinfo_[cls.ClassName];
  }

  function getClassTypeinfo(cls) {
    var n=cls.ClassName, p=_classinfo_[n];
    while (p && p.class_ !== cls) p = p.next__;

    if (p===undefined) throw new Error(EAccessInvaildClass);
    return p;
  }

  function setClassTypeinfo(cls, instance, diff, Attr) {
    var n=cls.ClassName, p=_classinfo_[n];
    while (p && p.class_ !== cls) p = p.next__;

    if (p!==undefined) throw new Error(EInvalidClass);
    cls.Create.prototype = instance;
    _classinfo_[n] = new ClassTypeinfo(cls, diff, Attr);
  }
  function diffProperties(ref, Q, diffed) {
    // "this" and ref is sorted property array
    // "this" is sub-set of a the <ref>.
    // diffed is null array or undefined
    if (!ref || !ref.length) {
      if (!diffed) return diffed = this.slice(0);
      Array.prototype.push.apply(diffed, this);
    }
    else {
      if (!diffed) diffed = [];
      var i = j = 0, x=this.length;
      while (i<x) {
        if (this[i]==ref[j] && Q(ref[j++])) {
          i++;
        }
        else {
          diffed.push(this[i++]);
        }
      }
    }
    return diffed;
  }

  // get prototypeInfo and propertyName
  function getPrototype(cls) { return  (cls ? cls.Create.prototype : {}) }
  function getAttrPrototype(cls) { return getClassTypeinfo(cls).$Attr_ }
  function getDiffProperties(cls) { return getClassTypeinfo(cls).$diff_ }
  function getPropertyName(p, obj) { for (var n in obj) if (obj[n]===p) return n }

  // create and hide Class Data Block
  function ClassDataBlock() {
    var Attr = function() {}; // all getter and setter method of attributes
    var _attributes = this; // all names and value(for class) of attributes.
    var _events = []; // all events, with all parent class's event define
    var _maps = {}; // cache method inherited call maps

    function all(n) {
      switch (n) {
        case 'event': return _events;
      }
    }

    function getAttribute(n) { return Attr[n] }
    function setAttribute(n, v) { Attr[n] = v }
    function hasOwnProperty(n) { return _attributes[n] === _undefined_ }

    var Name = arguments[1];
    var Parent = arguments[0];
    var cls = function (Constructor) {
      var _diff=[], parent={};
      // create Class typeinfo node, add to class's prototype inherit tree.
      if (cls.ClassParent) {
        // call getClassTypeinfo() and getDiffProperties()
        with (getClassTypeinfo(cls.ClassParent)) {
          parent = getPrototype(class_), Attr.prototype = $Attr_, _diff = $diff_;
        }
      }
      Attr = new Attr();
      Attr.hasOwnProperty = hasOwnProperty;

      var diff = [], base = new Constructor();
      for (var i in base) {
        // check function, collection all events and attributes
        if (base[i] instanceof Function) {
          if (_r_event.test(i)) _events.push(i);
          if (_r_attribute.exec(i)) {
            Attr[i] = base[i];
            _attributes[i] = _undefined_;
            delete base[i];

            // if (!(RegExp.$2 in Attr)) Attr[RegExp.$2] = undefined;
            if (Attr[RegExp.$2] === undefined) Attr[RegExp.$2] = _undefined_;
            continue;
          }
        }
        diff.push(i);
      }
      diff.sort();
      diff.diffed = diffProperties.apply(diff, [_diff, function(p) {
        return parent[p] === base[p];
      }]);
      setClassTypeinfo(cls, base, diff, Attr);
    }

    function inheritedAttribute(foo) {
      var n=getPropertyName(foo, Attr);
      if (n === undefined) return;

      // isn't TObject, and ignore instance's method
      var p, v=[], $cls=Parent;
      while ($cls) {
        p = getAttrPrototype($cls);
        if (p.hasOwnProperty(n)) v.push(p[n]);
        $cls = $cls.ClassParent;
      }
      if (v[0] !== foo) v.unshift(foo);
      return v;
    }

    function getInheritedMap(method) {
      if (!(method instanceof Function)) return [method, $inherited_invalid];

      // for first call only: getInheritedMap.call(this_instance, method);
      // search in _maps
      for (var i=0, len=_maps.length; i<len; i++) if (_maps[i][0] === method) return _maps[i];

      // is Attribute getter/setter?
      var a=inheritedAttribute(method);
      if (!a) {
        // initialization first map node
        var p, n, a=[method], $cls=cls;
        var isSelf = getInheritedMap.caller.caller === method;
        if (n=getPropertyName(method, this)) {
          // check method re-write in object-constructor section
          if (method === getPrototype($cls)[n]) a.pop();
          // check call by same-name method
          if (!isSelf) a.push(method);
          // create inherited stack
          while ($cls) {
            p = getPrototype($cls);
            // if (p.hasOwnProperty(n)) a.push(p[n]);
            if (getDiffProperties($cls).diffed.indexOf(n) > -1) a.push(p[n]);
            $cls = $cls.ClassParent;
          }
        }
      }
      a.push($inherited_invalid);
      return (_maps[len] = a);
    }

    cls.OnClassInitializtion = _joinpoints_.weaving('Initializtion', function(Constructor) {
      if (Parent) Constructor.prototype = getPrototype(Parent);
      this.all = all;
      this.map = getInheritedMap;
      this.get = getAttribute;
      this.set = setAttribute;
      this.attrAdapter = getAttribute;
    });

    cls.OnClassInitialized = _joinpoints_.weaving('Initialized', function(IDB) {
      delete this.all;
      delete this.map;
      delete this.get;
      delete this.set;
      delete this.attrAdapter;
      delete this.OnClassInitializtion;
      delete this.OnClassInitialized;
      if (Parent) IDB.prototype = getAttrPrototype(cls);
    });

    // TypeInfo of the class. Don't change anything!!!
    cls.ClassName = 'T' + Name;
    cls.ClassInfo = cls;
    cls.ClassParent = Parent;
    cls.toString = $QomoCoreFunction(cls.ClassName);

    return cls;
  }

  // inline getter for $import()
_inline_object_registerToActiveNamespace: {

  var $import_getter = $import.get;

}


  // Real Class() keyword
  function _Class(Parent, Name) {
    var args = arguments;
    if (args.length==0) throw new Error(ECallClassBadArguments);

    if (args.length==1) {
      if ((typeof args[0]=='string') || (args[0] instanceof String)) {
        return _Class((args[0]=='Object' ? null : TObject), args[0]);
      }
      throw new Error(ECallClassBadArguments);
    }

    // get a reference of the constructor foo
    var Constructor = eval(Name);
    if (!(Constructor instanceof Function)) throw new Error(ERegClassNoname);

    // Class is a function
    // base is prototype of the class, and create from navtive Constructor
    var cls = new ClassDataBlock(Parent, Name);
    cls.OnClassInitializtion(Constructor);

    // some member reference for class
    var $all = cls.all;
    var $map = cls.map;
    var $attr = cls.attrAdapter;

    // Attribute getter/setter, and method inherited call for per instance
    function InstanceDataBlock() {
      var data_ = this; // can't new Object() in here! throw "too much recursion" error in moz!
      var cache = [];   // cached call map.

      this.get = function (n) {
        if (arguments.length==0) {
          // call from custom-built getter/setter
          // custom-built func call from real(and for outside) this.get/set() only!
          var args = this.get.caller.arguments;
          n = args.length == 1 ? args[0] : args[1];
          if (this.get.caller!==$attr((args.length==1 ? 'get':'set') + n)) return;
        }
        else {
          // get custom-built getter from cls's $Attr.getXXXXXX
          // in ClassDataBlock, the ref. equ data_['get'+n]
          var f = $attr('get'+n);
          if (f) return f.call(this, n);
        }

        if (data_[n] === _undefined_) return undefined;
        return data_[n]; // a value
      }

      this.set = function (n, v) {
        if (arguments.length==1) {
          v = n;
          var args = this.set.caller.arguments;
          n = args.length == 1 ? args[0] : args[1];
          if (this.set.caller!==$attr((args.length==1 ? 'get':'set') + n)) return;
        }
        else {
          var f = $attr('set'+n);
          if (f) return f.call(this, v, n);
        }

        // if (n in data_) return void(data_[n]=v);
        if (v === undefined) v = _undefined_;
        if (data_[n] !== undefined) return void(data_[n]=v);
        throw new Error(EWriteUndefinedAttr);
      }

      this.inherited = function(method) {
        var f=this.inherited.caller, args=f.arguments;

        // arguments analyz
        if (method) {
          if (typeof method=='string' || method instanceof String) f=this[method];
          else if (method instanceof Function) f=method;
          else f=null;
          if (arguments.length > 1) {
            args = (arguments[1] instanceof CustomArguments) ? arguments[1].result
              : Array.prototype.slice.call(arguments, 1);
          }
        }
        if (!f) $inherited_invalid();

        // find f() in cache, and get inherited method p()
        for (var p, i=0; i<cache.length; i++) {
          if (f === cache[i][0]) {
            p = cache[i];
            p.shift();
            return p[0].apply(this, args);
          }
        }

        // if can't find in cache, call $map(), get a inherited tree and push to cache's top.
        var p = cache[cache.length] = $map.call(this, f).slice(1);
        // begin call inherited. at after, we will delete it from cache.
        try {
          var v = p[0].apply(this, args);
        }
        finally {
          cache.remove(p);
        }
        return v;
      }
      this.inherited.toString = $inherited_str;
      this.get.toString = $getter_str;
      this.set.toString = $setter_str;
    }

    // AClass.Create
    cls.Create = function () {
      if (this===cls) {
        // 'this' is class ref.
        var i, v=arguments, n=v.length, s='new this.Create(';
        if (n>0) for (i=1,s+='v[0]'; i<n; i++) s += ', v[' + i +']';
        return eval(s+');');
      }
      else if (this && this.constructor===cls.Create) {
        // Make a DataBlock for per Instance, and reset attributes getter/setter.
        var Data = new InstanceDataBlock();
        this.get = Data.get;
        this.set = Data.set;
        this.inherited = Data.inherited;

        // MuEvents init(base per instance).
        var all = $all('event');
        for (var i=0, imax=all.length; i<imax; i++) this[all[i]] = new MuEvent();

        // class method to object method
        if (this.Create) this.Create.apply(this, arguments);
      }
      else {
        throw new Error(ECreateInstanceFail);
      }
    }

_inline_object_regAllInterfaceForClass: {

    // register interfaces for Class's all instnaces
    if (arguments.length > 2) {
      Interface.RegisterInterface.apply(cls, [cls].concat(
        Array.prototype.slice.call(arguments, 2)
      ))
    }

}

_inline_object_aggregateInterfaceToConstractor: {

    // register aggregated interfaces for the cls.Create()
    // register aggregated interfaces for the cls()
    var _ClassIntfs = Aggregate(cls, IJoPoints, IClass);
    var _ConstructorIntfs = Aggregate(cls.Create, IJoPoints, IObject, IAttrProvider, IAttributes);
    var intf = _ClassIntfs.GetInterface(IClass);
    var intf2 = _ConstructorIntfs.GetInterface(IObject);
    var intf3 = _ConstructorIntfs.GetInterface(IAttrProvider);
    intf2.hasEvent = function(n) { return _r_event.test(n) && (n in this) };
    intf2.hasProperty = function(n) { return n in this };
    intf2.hasOwnProperty = function(n) { return this.hasOwnProperty.apply(this, arguments) };
    intf.hasAttribute = intf2.hasAttribute = intf3.hasAttribute = function(n, t) {
      var _proto_ = getAttrPrototype(cls);
      return (n in _proto_ ? eval($cc_attr[t]) : false);
    }
    intf.hasOwnAttribute = intf2.hasOwnAttribute = intf3.hasOwnAttribute = function(n, t) {
      var _proto_ = getAttrPrototype(cls);
      return (_proto_.hasOwnProperty(n) ? eval($cc_attr[t]) : false);
    }
    var intf = _ClassIntfs.GetInterface(IJoPoints);
    // TODO: implement the interfaces

    var intf = _ConstructorIntfs.GetInterface(IJoPoints);
    // TODO: implement the interfaces

}


    // at after define cls.create(), do Init
    cls(Constructor);
    cls.OnClassInitialized(InstanceDataBlock);

_inline_object_aggregateInterfaceAfterClassRegistered: {

    // implement IAttributes
    var intf4 = _ConstructorIntfs.GetInterface(IAttributes);
    void function(){
      var length=0, all={}, _proto_=getAttrPrototype(cls);
      for (var n in _proto_) {
        if (_proto_[n] instanceof Function) continue;
        all[length++] = all[n] = {
          name: n,
          tags: eval($cc_attr['*']) ? 'rw'
            : (eval($cc_attr['r']) ? 'r'
            : (eval($cc_attr['w']) ? 'w'
            : ''))
        }
      }

      intf4.getLength = function() { return length }
      intf4.items = function(i) { if (!isNaN(i)) return all[i] }
      intf4.names = function(n) { if (all.hasOwnProperty(n)) return all[n] }
    }();

}


    // set prototype properties for instance object
    cls.Create.toString = function() { return Constructor.toString() };
    cls.Create.prototype.constructor = cls.Create;
    cls.Create.prototype.ClassInfo = cls;

    // rewrite constructor function
    //   MyObject = TMyObject.Create;
    eval(Name + '= cls.Create');

    // register class into current active namespace
_inline_object_registerToActiveNamespace: {

    var activeSpc = $import_getter('activeSpc');
    if (activeSpc) {
      var spc = activeSpc();
      cls.SpaceName = spc.toString();
      spc[cls.ClassName] = cls;
    }

}


    // return Class type reference 'cls'
    return cls;
  }

_inline_object_aggregateInterfaceToClassRegister: {

  // register aggregated interfaces for the Class();
  var _ClassRegisterIntfs = Aggregate(_Class, IJoPoints, IClassRegister);
  var intf = _ClassRegisterIntfs.GetInterface(IJoPoints);
  intf.getLength = function() { return _joinpoints_.length }
  intf.items = function(i) { return _joinpoints_.items(i) }
  intf.names = function(n) { if (!isNaN(n)) return _joinpoints_[n] }
  var intf = _ClassRegisterIntfs.GetInterface(IClassRegister);
  intf.hasClass = function(n) { return !!(n.indexOf('.')>-1 ? eval(n) : _classinfo_[n]) }

}

  return _Class;
}();


/**
 * Object() and TObject Class for Qomo
 * Register TObject class, It's class inherit tree's root.
 * - If you want, you can set Object.prototype to other!!!
 */
void function() {
  var _RTLOBJECT = new Object();
  Object = function () {}
  Object.prototype = new _RTLOBJECT.constructor();
}();
TObject = Class('Object');


/**
 * Utility Functions _get(), _set(), _cls()
 * - need call in class register and init
 */
_get = function(n) { return _get.caller.caller.get(n) }
_set = function(n,v) { return _set.caller.caller.set(n, v) }
_cls = function() { return _cls.caller.caller }
$import.setActiveUrl("Framework/RTL/Templet.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.28]

 - Templet Support Unit
*****************************************************************************/

function Templet() {
  Attribute(this, 'TempletContext', '');

  var _r_templet = /\%(.*?)\%/gi;
  var _toString = function(src) {  /* %..% */
    var _src = (!src ? this : src);
    var i = Interface.QueryInterface(_src, IAttrProvider);
    var v = { 'TempletContext': '%TempletContext%' };

    return this.get('TempletContext').replace(_r_templet, function($0, $1) {
      return ($1=='' ? '%' : (v.hasOwnProperty($1) ? v[$1]
        : (v[$1] = i.hasAttribute($1, 'r') ? _src.get($1) : $0)));
    });
  }

  this.toString = _toString;
  this.Create = function(src) {
    if (src && Interface.QueryInterface(src, IAttrProvider)) {
      var _src = src;
      this.toString = function() { return _toString.call(this, _src) }
    }
  }
}

TTemplet = Class(TObject, 'Templet');
$import.setActiveUrl("Framework/RTL/Aspect.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.28]

 - AOP Support Unit
 - Four Classes: TFunctionAspect, TClassAspect, TObjectAspect, TCustomAspect
   and a Abstract class: TAspect
 - support pointcut:
     for TFunctionAspect : 'Function'
     for TClassAspect  : 'Method'
     for TObjectAspect : 'Method', 'Event', 'AttrGetter', 'AttrSettter'
     for TCustomAspect : cutstom pointcut by user code in observable
*****************************************************************************/

var
  EPointCutAnalyzerNoPass = [8181, 'PointCut Analyzer No Pass.'];

TOnAspectBehavior = function(observable, aspectname, pointcut, args) {};
TOnAspectAfter = function(observable, aspectname, pointcut, args, value) {};

/**
 * AOP base class
 */
function Aspect() {
  var GetHandle = {};

  Attribute(this, 'AspectHost', null, 'rw');
  Attribute(this, 'AspectName', null, 'rw');
  Attribute(this, 'AspectType', null, 'r'); // Class, Object or Custom
  Attribute(this, 'PointCut', '', 'rw');
  Attribute(this, 'MetaData', null, 'rw');
  Attribute(this, 'PointCutAnalyzer', NullFunction, 'r');

  function $Aspect(pointcut, foo) {
    var _aspect = this;
    var point = pointcut;
    var host = _aspect.get('AspectHost');  //???
    var name = _aspect.get('AspectName');
    var f = foo;

    return function($A) {
      if ($A===GetHandle) return f;

      var _value, _intro = _cancel = _aspect.OnIntroduction(this, name, point, arguments) !== false;
      if (_intro) _aspect.OnBefore(this, name, point, arguments);
      if (_intro) _cancel = _aspect.OnAround(this, name, point, arguments) === false;
      if (!_cancel) _value = f.apply(this, arguments);
      if (_intro) _aspect.OnAfter(this, name, point, arguments, _value);
      return _value;
    }
  }

  this.supported = Abstract;

  this.assign = function(host, name, pointcut) { /* meta0 .. metan */
    this.set('AspectHost', host);
    this.set('AspectName', name);
    this.set('PointCut', pointcut);
    this.set('MetaData', Array.prototype.slice.call(arguments, 3));
    if (!(this.get('PointCutAnalyzer').call(this, pointcut))) {
      throw new Error(EPointCutAnalyzerNoPass);
    }

    var n, instance=this.get('AspectHost');
    switch (pointcut) {
      case 'AttrGetter': n = 'get'; break;
      case 'AttrSetter': n = 'set'; break;
      default:
        n = this.get('AspectName');
    }

    if (pointcut == 'AttrGetter' || pointcut == 'AttrSetter') {
      var f = instance[n];
      var adpa = $Aspect.call(this, pointcut, f);
      var attr = this.get('AspectName');
      instance[n] = function(n) {
        return ((arguments.length>0 && n==attr) ? adpa : f).apply(this, arguments);
      }
    }
    else if (pointcut == 'Function') {
      // is global function
      var f = $Aspect.call(this, pointcut, host);
      eval(['if (host===', n, ') ', n, '=f'].join(''));
    }
    else {
      // is method or event
      instance[n] = $Aspect.call(this, pointcut, instance[n]);
    }
  }

  this.unassign = function() {
    var instance=this.get('AspectHost');
    if (!instance) return;

    var n, pointcut=this.get('PointCut');
    switch (pointcut) {
      case 'AttrGetter': n = 'get'; break;
      case 'AttrSetter': n = 'set'; break;
      default:
        n = this.get('AspectName');
    }

    if (!n) return;

    if (pointcut == 'Function') {
      eval([n, '=', n, '(GetHandle);'].join(''));
      if (eval(n) !== instance) throw new Error();
    }
    else if (instance[n] instanceof Function) {
      instance[n] = instance[n](GetHandle);
    }
    this.set('AspectHost', null)
  }

  var $Aspects = ['OnIntroduction', 'OnBefore', 'OnAfter', 'OnAround'];
  this.merge = function() { /* dest0 .. destn */
    if (arguments.length == 0) return;

    var args=arguments, argn=args.length;
    var f = function(e) {
      this[e] = new MuEvent(this[e]);
      for (var i=0; i<argn; i++) this[e].add(args[i][e]);
    }
    // $Aspects.forEach(f, this)
    for (var i=0; i<$Aspects.length; i++) {
      f.call(this, $Aspects[i]);
    }
  }

  this.combine = function() { /* dest0 .. destn */
    if (arguments.length == 0) return;

    var args=arguments, argn=args.length;
    var f = function(e) {
      this[e] = new MuEvent(this[e]);
      for (var i=0; i<argn; i++) {
        this[e].add(args[i][e]); // append to cast list
        args[i][e] = this[e];    // replace for dest0 .. destn
      }
    }
    // $Aspects.forEach(f, this)
    for (var i=0; i<$Aspects.length; i++) {
      f.call(this, $Aspects[i]);
    }
  }

  this.unmerge = function() {
    return this.uncombine();
  }

  this.OnIntroduction = TOnAspectBehavior;
  this.OnBefore = TOnAspectBehavior;
  this.OnAfter = TOnAspectAfter;
  this.OnAround = TOnAspectBehavior;

  this.Create = function() {
    var _self = {
      OnIntroduction: this.OnIntroduction,
      OnBefore: this.OnBefore,
      OnAfter: this.OnAfter,
      OnAround: this.OnAround
    }
    this.uncombine = function() {
      this.OnIntroduction = _self.OnIntroduction;
      this.OnBefore = _self.OnBefore;
      this.OnAfter = _self.OnAfter;
      this.OnAround = _self.OnAround;
    }

    if (arguments.length > 0) this.assign.apply(this, arguments);
  }
}


/**
 * Aspect for any functions, global or local
 */
function FunctionAspect() {
  _set('AspectType', 'Function');
  _set('PointCutAnalyzer', function(pointcut) {
    return (this.supported(pointcut) && !!this.get('AspectHost'));
  });

  this.supported = function(pointcut) {
    return ({
       'Function': null
    }[pointcut] !== undefined)
  }
}


/**
 * Aspect for Class, join to prototype method only.
 */
function ClassAspect() {
  Attribute(this, 'HostClass', null, 'rw');
  _set('AspectType', 'Class');
  _set('PointCutAnalyzer', function(pointcut) {
    if (this.supported(pointcut)){
      var n = this.get('AspectName');
      switch (pointcut) {
        case 'Method': return (this.get('AspectHost')[n] instanceof Function);
      }
    }
  });

  this.supported = function(pointcut) {
    return ({
       'Method': null
    }[pointcut] !== undefined)
  }

  this.assign = function(host, name, pointcut) {
    this.set('HostClass', host);
    arguments[0] = (host['ClassInfo'] ? host.Create : host.constructor).prototype;
    this.inherited();
  }
}


/**
 * Aspect for Object, join to attribute's get/set, event and method.
 */
function ObjectAspect() {
  Attribute(this, 'HostInstance', null, 'rw');
  _set('AspectType', 'Object');

  _set('PointCutAnalyzer', function(pointcut) {
    var obj = this.get('HostInstance');
    if (this.supported(pointcut)){
      var n = this.get('AspectName');
      switch (pointcut) {
        case 'AttrGetter':
        case 'AttrSetter': return ((obj instanceof TObject.Create) &&
          Interface.QueryInterface(obj, IObject).hasAttribute(n));
        case 'Event': if (!_r_event.test(n)) return false;
        case 'Method': return (obj[n] instanceof Function);
      }
    }
  });

  this.supported = function(pointcut) {
    return ({
      AttrGetter: null,
      AttrSetter: null,
      Method: null,
      Event: null
    }[pointcut] !== undefined)
  }

  this.assign = function(host, name, pointcut) {
    this.set('HostInstance', host);
    this.inherited();
  }
}

/**
 * Aspect for Custom JoinPoint(s), join to IJoPoints interface by any function(and object).
 */
function CustomAspect() {
  _set('AspectType', 'Custom');

  this.setAspectHost = function(v) {
    var pts = Interface.QueryInterface(v, IJoPoints);
    if (!pts) throw new Error();
    this.unassign();
    this.set(v);
  }

  this.supported = function(pointcut) {
    var pts, host = this.get('AspectHost');
    return (host && (pts=Interface.QueryInterface(host, IJoPoints)) && pts.items(pointcut));
  }

  this.assign = function(host, name, pointcut) {
    this.set('AspectHost', host);
    this.set('AspectName', name);
    this.set('PointCut', pointcut);
    this.set('MetaData', Array.prototype.slice.call(arguments, 3));
    if (this.supported(pointcut)) {
      var pts = Interface.QueryInterface(this.get('AspectHost'), IJoPoints);
      var pt = pts.items(pointcut);
      pt.assign(name, this);
    }
  }

  this.unassign = function() {
    var host = this.get('AspectHost');
    if (host) {
      var pts = Interface.QueryInterface(host, IJoPoints);
      var pt = pts.items(this.get('PointCut'));
      pt.unassign(this.get('AspectName'));
    }
  }
}


/**
 * Class Register for AOP Framework
 */
TAspect = Class(TObject, 'Aspect', IAspect);
TFunctionAspect = Class(TAspect, 'FunctionAspect');
TClassAspect = Class(TAspect, 'ClassAspect');
TObjectAspect = Class(TAspect, 'ObjectAspect');
TCustomAspect = Class(TAspect, 'CustomAspect');
$import.setActiveUrl("Framework/Classes.js");
/**
 *
 * Base Common Classes
 *
 */

// System Utils
/* context imported... */


// Timer
/* context imported... */


// Time Machine, and Steper, Trigger
/* context imported... */


// Timeline, base TimeMachine
/* context imported... */


// Utils for Object
/* context imported... */


// Convert Utils
/* context imported... */


// Common Cache Pool Class
/* context imported... */


// HttpGet Machine, base PoolMachine.
/* context imported... */

$import.setActiveUrl("Framework/Common/SysUtils.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.04.23]

 - System utils functions
*****************************************************************************/

/**
 * get a unique id in global and future system environment
 */
function createUniqueID(){
  return '_' + new Date().valueOf() + Math.random();
}

/**
 * get a unique variant in global, and you can delete it everytime
 */
function createUniqueVar() {
  var name = createUniqueID().replace('.', '_');
  window.execScript(name+'=void null;', 'JavaScript');
  return name;
}

/**
 * check a string is a global variant.
 */
function isVariant(/* variant name string */) {
  try {
    eval(arguments[0]);
    return true;
  }
  catch (e) {
    return false;
  }
}

/**
 * check a variant is defined.
 */
function defined(v) {
  return v !== void null;
}
$import.setActiveUrl("Framework/Common/Timer.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - common interface: ITimer
 - class TTimer
*****************************************************************************/

/**
 * Interfaces of timer architectur
 */
ITimer = function() {
  this.start = Abstract;    // function(type, ms) {}
  this.OnTimer = Abstract;  // function(step) {}
  this.stop = Abstract;
}

/*DTTI
 * <summary>TTimer Class</summary>
 * <define name="Timer" kind="class" extand="Object" />
 */
function BaseTimer() {
  Attribute(this, 'TimerID', NaN, 'rw');
  Attribute(this, 'TimerData', null, 'rw');

  /*DTTI
   * <summary>Start, Timer and Stop Multi Cast Event</summary>
   */
  this.OnStart = NullFunction;
  this.OnTimer = NullFunction;
  this.OnStop = NullFunction;

  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   */
  this.start = function(){
    this.OnStart();
  }

  /*DTTI
   * <summary>stop timer</summary>
   * <define name="stop" kind="method" />
   */
  this.stop = function() {
    var id = this.get('TimerID');
    if (!isNaN(id)) {
      clearInterval(id);
      clearTimeout(id);
      this.set('TimerID', NaN);
    }
    this.OnStop();
  }

  /*DTTI
   * <summary>object init. in create timer</summary>
   * <define name="Create" kind="constructor" />
   * <param name="*" type="*">paraments with format ([object, ]method)</param>
   */
  this.Create = function() {
    for (var i=0, args=arguments, argn=args.length; i<argn; i++) {
      if (args[i] instanceof Function) {
        this.OnTimer.add(args[i]);
      }
      else {
      	this.OnTimer.addMethod(args[i], args[++i]);
      }
    }
  }
}

function Timer() {
  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   * <param name="type" type="String">timer type, values:
   *   - Timeout: Evaluates after a specified number of milliseconds has elapsed.
   *   - Interval: Evaluates each time a specified number of milliseconds has elapsed.
   * </param>
   * <param name="ms" type="Integer">specifies the number of milliseconds</param>
   */
  this.start = function(type, ms) {
    var step=0, vCode=new MuEvent();
    vCode.addMethod(this, function() {
      this.OnTimer(step++);
    });
    this.inherited();
    this.set('TimerID', window['set'+type](vCode, ms));
  }
}

TBaseTimer = Class(TObject, 'BaseTimer');
TTimer = Class(TBaseTimer, 'Timer', ITimer);

$import.setActiveUrl("Framework/Common/TimeMachine.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - common interface: ITimeMachine
 - unified architecture: time machine and data provider
 - class TTimeMachine
*****************************************************************************/
/* context imported... */


ITimeMachine = function() {
  this.start = Abstract;    // function(time, data) {}
  this.OnTimer = Abstract;  // function(step, data) {}
  this.stop = Abstract;
}

function TimeMachine() {
  function _Provider(step, last) {
    return this.get('Data')[step];
  }

  function _Factory(aClass, aObj) {
    if (aObj instanceof Steper) return aObj;
    if (aObj instanceof Array) {
      var instance = aClass.Create();
      instance.set('Data', aObj);
      instance.OnStep.add(_Provider);
      return instance;
    }
    else { // is number?
      $assert((typeof aObj == 'number') || (aObj instanceof Number), 'param invaild for TTimeMachine.start().');
      var instance = aClass.Create();
      instance.set('Data', aObj);
      instance.OnStep.add(new Function('return ' + Number(aObj).toString()));
      return instance;
    }
  }

  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   * <param name="data" type="TSteper, Array">specifies the TSteper object or data_value array</param>
   * <param name="time" type="TSteper, Array">specifies the TSteper object or time_value array</param>
   */
  this.start = function(data, time) {
    // provider constructing
    var sequ = _Factory(TLineSteper, data);
    var line = _Factory(TSequenceSteper, time);

    var ms, step, last=undefined;
    var vCode = new MuEvent();
    vCode.addMethod(this, function() {
      // get last and try OnTimer()
      last = sequ.OnStep(step, last);
      if (last === undefined) return void this.stop();
    	this.OnTimer(step, last);

      // get elapsed MilliSeconds, and setTimeout()
      ms = line.OnStep(++step, ms);
      if (ms < 1) return void this.stop();
      this.set('TimerID', window.setTimeout(vCode, ms));
    });

    // initialize data of ms and step, start timer.
    this.inherited();
    this.set('TimerID', window.setTimeout(vCode, ms=line.OnStep(step=0, 0)));
  }
}

TTimeMachine = Class(TBaseTimer, 'TimeMachine', ITimeMachine);
$import.setActiveUrl("Framework/Common/StepTrigger.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - Class TStepTrigger for TimeMachine.js
 - Code mount from Yahoo UI.
*****************************************************************************/

/**
 * defining the acceleration rate and path of animations.
 * code from yui/animation/src/js/Easing.js, changed by aimingoo
 *
 * - doCalc(this.currentFrame, start, end - start, this.totalFrames);
 *     @param {Number} t Time value used to compute current value.
 *     @param {Number} b Starting value.
 *     @param {Number} c Delta between start and end values.
 *     @param {Number} d Total length of animation.
 * - return {Number} The computed value for the current animation frame.
 */
function StepTrigger() {
  /**
   * Uniform speed between points.
   */
  this.easeNone = function(t, b, c, d) {
    return b+c*(t/=d); 
  };
  
  /**
   * Begins slowly and accelerates towards end.
   */
  this.easeIn = function(t, b, c, d) {
    return b+c*((t/=d)*t*t);
  };
  
  /**
   * Begins quickly and decelerates towards end.
   */
  this.easeOut = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(tc + -3*ts + 3*t);
  };
  
  /**
   * Begins slowly and decelerates towards end.
   */
  this.easeBoth = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(-2*tc + 3*ts);
  };
  
  /**
   * Begins by going below staring value.
   */
  this.backIn = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(-3.4005*tc*ts + 10.2*ts*ts + -6.2*tc + 0.4*ts);
  };
  
  /**
   * End by going beyond ending value.
   */
  this.backOut = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(8.292*tc*ts + -21.88*ts*ts + 22.08*tc + -12.69*ts + 5.1975*t);
  };
  
  /**
   * Starts by going below staring value, and ends by going beyond ending value.
   */
  this.backBoth = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(0.402*tc*ts + -2.1525*ts*ts + -3.2*tc + 8*ts + -2.05*t);
  }

   /**
    * code from yui/animation/src/js/Bezier.js, changed by aimingoo
    *
    * Get the current position of the animated element based on t.
    * @param {array} points An array containing Bezier points.
    * Each point is an array of "x" and "y" values (0 = x, 1 = y)
    * At least 2 points are required (start and end).
    * First point is start. Last point is end.
    * Additional control points are optional.    
    * @param {float} t Basis for determining current position (0 < t < 1)
    * @return {object} An object containing int x and y member data
    */
  this.bezierPosition = function(points, t) {  
    var n = points.length;
    var tmp = [];

    for (var i = 0; i < n; ++i){
      tmp[i] = [points[i][0], points[i][1]]; // save input
    }

    for (var j = 1; j < n; ++j) {
      for (i = 0; i < n - j; ++i) {
        tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
        tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
      }
    }

    return [ tmp[0][0], tmp[0][1] ]; 
  }
}

TStepTrigger = Class(TObject, 'StepTrigger');
$import.setActiveUrl("Framework/Common/Steper.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - Class TSteper, TLineSteper, TSequenceSteper for TimeMachine.js
*****************************************************************************/

/*DTTI
 * <summary>step by step function</summary>
 * <define name="OnStep" kind="Event"/>
 * <return type="*">last step data</return>
 */
TOnStep = function(nStep, nLast) {}

/*DTTI
 * <summary>TTimeline Class</summary>
 * <define name="TTimeline" kind="class" extand="Object" />
 */
function Steper() {
  Attribute(this, 'Data', null, 'rw');
  this.OnStep = TOnStep;
}

TSteper = Class(TObject, 'Steper');
TLineSteper = TSteper;
TSequenceSteper = TSteper;
$import.setActiveUrl("Framework/Common/YuiSteper.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - Class TYuiSteper for TimeMachine.js
 - Code mount from Yahoo UI.
*****************************************************************************/

function YuiSteper() {
  Attribute(this, 'Easing', 'easeOut');
  Attribute(this, 'Points', null);

  Attribute(this, 'Frames', 100);
  Attribute(this, 'Fps', 200);
  Attribute(this, 'From', 0);
  Attribute(this, 'To', 100);

  var trig = TStepTrigger.Create();

  var doStep = function(step, data) {
    var method = trig[this.get('Easing')];
    var frames = this.get('Frames');
    if (method && step<=frames) {
      var from = this.get('From');
      var count = this.get('To')-from;
      var pts, val = method(step, from, count, frames);
      if (pts = this.get('Points')) {
        val = trig.bezierPosition(pts, val/count);
      }
      return val;
    }
  }

  this.Create = function() {
    this.OnStep.add(doStep);

    // todo:
    //   - calc Fps
    //   - calc Frames
  }
}

TYuiSteper = Class(TSteper, 'YuiSteper');
$import.setActiveUrl("Framework/Common/Timeline.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - class TTimeline, you can defined flated and interlaced timeline
*****************************************************************************/

function Timeline() {
  function _Interval(ms) {
    var step = TSteper.Create();
    step.OnStep = new Function('return ' + ms);
    return step;
  }

  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   * <param name="data" type="TSteper, Array">specifies the TSteper object or data_value array</param>
   * <param name="time" type="TSteper, Array, Integer">specifies the TSteper object or time_value array, or a timeline interval.</param>
   * <return type="undefined">!!! warnning</return>
   */
  this.start = function(data, time) {
    this.inherited('start', data, (isNaN(time) ? time : _Interval(parseInt(time))));
  }
}

TTimeline = Class(TTimeMachine, 'Timeline');
$import.setActiveUrl("Framework/Common/ObjUtils.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2007.01.30]

 - some util functions for object
*****************************************************************************/

/**
 * TWeek = Enum('','','')
 */
function _Enum(args) {
  this.toLocaleString = args;
}
_Enum.prototype.valueOf = function (v) {
  return this.toLocaleString[v];
}
_Enum.prototype.nameOf = function (v) {
  return this.toLocaleString[v];
}
_Enum.prototype.indexOf = function (v) {
  for (var args = this.toLocaleString, i = 0; i < args.length; i++)
    if(args[i] == v) return i;
  return -1;
}
function Enum() {
  var i=0, args=arguments, l=args.length, obj=new _Enum(args);
  while (i<l) obj[args[i]]=i++;
  obj.low = function () {return 0};
  eval('obj.high = function () {return ' + (l-1) + '};');

  return obj;
}

/**
 * batch attributes or properties of object.
 */
function getAttributes(obj, filter) {
  $debug('getAttributes() failed.');
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

function setAttributes(obj, v) {
  for (var i in v) obj.set(i, v[i]);
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
  data: {},
  set: function(n, v){this.data[n] = v},
  get: function(n) {return this.data[n]}
}
$import.setActiveUrl("Framework/Common/ConvUtils.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2007.01.30]

 - some convert util functions
*****************************************************************************/

function toDec(hex) {
  return parseInt(hex, 16);
}

function toHex(dec) {
  return (dec > 255 ? 'FF' : dec.toString(16, 2));
}

function longHexToDec(hex) {
  return [toDec(hex.substring(0,2)), toDec(hex.substring(2,4)), toDec(hex.substring(4,6))];
}
$import.setActiveUrl("Framework/Common/Pool.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2007.01.31]

 - Common Class: TPool, 
 - Define Machine prototype and events, states
*****************************************************************************/

var
  TMachineStateChange = function(state) {};
  TPoolStateChange = function(mac, state) {};

function Pool() {
  Attribute(this, 'Size', 0, 'rw');
  Attribute(this, 'FIFO', true, 'rw');

  Attribute(this, 'DataPool', null, 'rw');
  Attribute(this, 'BusyMachine', null, 'rw');
  Attribute(this, 'MachineQueue', null, 'rw');
  Attribute(this, 'MachineClass', null, 'rw');

  this.OnStateChange = TPoolStateChange;

  var Hook_MachineStateChange = function(state) {
    // 1. resume fire by pool
    if (state=='resume') return;

    // 2. fire pool.OnStateChange()
    var mac=this, pool=mac.pool;
    pool.OnStateChange(mac, state);

    // 3. is "sleep", release the data.
    if (state=='sleep')
      release.call(pool, mac);
    else if (state=='free')
      pool.get('BusyMachine').remove(mac);
  }

  var release = function(mac) {
    // scan DataPool, try process a data.
    if (mac.data = (this.get('FIFO') ? this.get('DataPool').shift() : this.get('DataPool').pop())) {
      this.OnStateChange(mac, 'resume');
      mac.OnStateChange('resume');
    }
    else {
      // or, reclaime a mac(hine)
      mac.data = mac.pool = null;
      this.get('BusyMachine').remove(mac);
      this.get('MachineQueue').push(mac);
    }
  }

  var require = function () {
    with (this.get('MachineQueue')) {
      if (length>0) return pop();
    }

    if (this.get('BusyMachine').length < this.get('Size')) {
      var cls = this.get('MachineClass');
      var mac = cls.Create.apply(cls, arguments);
      mac.OnStateChange.add(Hook_MachineStateChange);
      return mac;
    }
  }

  // push a data block.
  // if have sleeped machine, the launch machine with the data block.
  this.push = function(data) {
    var mac = require.call(this);
    if (!mac)
      this.get('DataPool').push(data);
    else {
      this.get('BusyMachine').push(mac);

      mac.pool = this;
      mac.data = data;

      mac.pool.OnStateChange(mac, 'resume');
      mac.OnStateChange('resume');
    }
  }

  this.Create = function(cls, size) {
    this.set('MachineClass', cls);
    this.set('MachineQueue', new Array());
    this.set('BusyMachine', new Array());
    this.set('DataPool', new Array());

    this.set('Size', isNaN(size)?0:+size);
  }
}

TPool = Class(TObject, 'Pool');
$import.setActiveUrl("Framework/Common/HttpGetMachine.js");
/*****************************************************************************
*
* Qomo Common Class - THttpGetMachine
*
*  A standard machine defined in Pool.js
*
* value of  xmlHttp.readyState :
*   0 The object has been created but has not been initialized because open method has not been called. 
*   1 The object has been created but the send method has not been called. 
*   2 The send method has been called and the status and headers are available, but the response is not yet available. 
*   3 Some data has been received. You can call responseBody and responseText to get the current partial results. 
*   4 All the data has been received, and the complete data is available in responseBody and responseText. 
*****************************************************************************/
/* context imported... */


function HttpGetMachine () {
  Attribute(this, 'XMLHTTP', null, 'rw');
  Attribute(this, 'METHOD', 'GET', 'r');

  this.OnStateChange = TMachineStateChange;

  var doStateChange = function(state) {
    if (state=='resume') {
      var xmlHttp = this.get('XMLHTTP');
      var method = this.get('METHOD');
      var data = null, src = this.data.src;

      if (method=='GET') {
        xmlHttp.open(method, src, true);
      }
      else {
        data = src.substr(src.indexOf('?')+1);
        src = src.substr(0, src.length-data.length-1);
        data = unescape(data);
        xmlHttp.open(method, src, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xmlHttp.setRequestHeader('Content-Length', data.length);
      }
      xmlHttp.send(data);
    }
    else if (state=='free') {
      this.set('XMLHTTP', null);
    }
  }

  var onreadystatechange = function() {
    var xmlHttp = this.get('XMLHTTP');

    this.OnStateChange(xmlHttp.readyState);

    if (xmlHttp.readyState==4) {
      // rewrite onreadystatechange() in ff
      xmlHttp.onreadystatechange = _changer(this);
      this.OnStateChange('sleep')
    }
  }

  var _changer = function(mac) {
    return function() {
      onreadystatechange.apply(mac, arguments);
    }
  }

  this.Create = function() {
    this.data = null;
    this.pool = null;
    this.OnStateChange.add(doStateChange);
    var ajx = new Ajax();
    this.set('XMLHTTP', ajx);
    this.get('XMLHTTP').onreadystatechange = _changer(this);
  }
}

THttpGetMachine = Class(TObject, 'HttpGetMachine');
$import.setActiveUrl("Components/Controls.js");
/*****************************************************************************
*
* Qomo 控件包引入单元
*
*****************************************************************************/

// 组件基础框架
/* context imported... */

// $import('Controls/PageStyleMgr.js');
// $import('Controls/ElementStyleMgr.js');
// $import('Controls/WinController.js');

// 界面交互处理
/* context imported... */

// $import('Controls/DragController.js');

// 1. 需要统一的drag和resize支持的组件, 需要在wincontroller之后加载, 这包括basepanel等
// $import('Controls/BaseControl.js');
// $import('Controls/Selector.js');

// Panel 组件
/* context imported... */

// $import('Controls/Panel.js');

// Outbar 组件
/* context imported... */


// TopoLogic 组件
/* context imported... */


// $import('Controls/ImageMap.js');

// $import('Controls/Basetoolbar.js');
// $import('Controls/XPToolbar.js');

// $import('Controls/MarqProcessbar.js');

// $import('TplLibrary.js');
// $import('CssLibrary.js');
$import.setActiveUrl("Components/Controls/HtmlUtils.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.09.15]

 Html Utils for Qomo's UI Framework layer.
  - Document Object
  - Context Parser
  - Event and UI Control Object
*****************************************************************************/


/*********************************************************************************************
*
* 全局对象, 可以在HTML全局暂存属性或特性值. 用于在不同的事件处理句柄中交互数据, 或传递信号.
*
* 全局对象的成员由Qomo约定. 如果第三方代码需要类同的机制, 应该另行声明对象.
*
**********************************************************************************************/
GLOBAL = {
  // 以下位置点基于screen
  lastCursor: null,  // 上一次暂存的cursor类型. 在这里, null与''是不同的. ''是style.cursor的
                     //   可能值, 因此它会是暂存的; 而null则表明没有暂存.
  lastX : 0,         // 上一次事件的x位置
  lastY : 0,         // 上一次事件的y位置
  X     : 0,         // 本次事件的x位置
  Y     : 0,         // 本次事件的y位置
  event : {},        // 上一个事件对象的抄写
  draging : null,      // 拖动中的对象. 如果对象是拖过控制器来拖动, 那加入draging[]的也将是对象自身.
  zooming : null,      // (缩放或)调整大小中的对象.
  zManager : {},     // 全局的z-Index序管理
  selector : null    // 全局的选择对象(全局范围内有且仅有一个selector)
}

GLOBAL.zManager.add = function (el) {
  var z=el.style.zIndex;
  if (z) {
    if (this[z]) this[z].push(el); else this[z]=[el];
  }
}

GLOBAL.zManager.remove = function (el) {
  var z=el.style.zIndex;
  if (z && this[z]) this[z].remove(el);
}

_DOC = window.document;


/*********************************************************************************************
*
* getFilter()
* findElement(), findElements(), isChildren(), inElements()
* findParent(), findForefather()
*
* getFilter(str), 用str生成一个查找用的filter信息块, 这是一个多维数组, 其基本格式为：
*   filter ===> [[fi],[fo]];
*   fi     ===> [[n1,v1],[n2,v2],...[nn,vn]]
*   fo     ===> [[n1,v1],[n2,v2],...[nn,vn]]
*
* findElement(el, filter, all),findElements(el, filter, all), 用于查找符合条件(filter)的元素.
* 如果all为true, 则表明查找el的所有包含元素, 否则查找一级clildren元素.
*
* isChildren(oEl, el), 用于检测el是否是oEl的子级(多级)结点
*
* inElements(oEls, el), oEls是一个父级结点的数组, 检测el是否包含在oEls的全部子结点(以及oEls自身)中
**********************************************************************************************/
function genFilter(str) {
  var i, f, fi=[], fo=[], ff=str.split(';'), len=ff.length;

  for (i=0; i<len; i++) {
    if (ff[i].charAt(0)=='-')
      fo.push((ff[i].substr(1)).split('='));
    else
      fi.push(ff[i].split('='));
  }
  
  return [fi, fo];
}

/**
 * params:
 *   - all: if is true, then search node of all level in the (el)ement.
 */
function findElement(el, filter, all) {
  if (typeof filter == 'string') filter=genFilter(filter);
  var i, j, v, fi=filter[0], fo=filter[1], all=(all)?el.all:el.children, len=all.length;

next:
  for (i=0; i<len; i++) {
    v = all[i];
    for (j=0; j<fi.length; j++) if (v[fi[j][0]]!=fi[j][1]) continue next;
    for (j=0; j<fo.length; j++) if (v[fo[j][0]]==fo[j][1]) continue next;
    return v;
  }
}

// 是指定元素的子元素
function isChildren(oEl, el) {
  while (el=el.parentElement)
    if (el===oEl) return true;
  return false;
}

// el被包含在"指定的元素及其子元素"所构成的集合(oEls)中
function inElements(oEls, el) {
  var i, len=oEls.length;
  do {
    for (i=0; i<len; i++) if (el===oEls[i]) return oEls[i];
  } while (el=el.parentElement);
  return null;
}


/*********************************************************************************************
*
* 界面元素的位置及大小

* 以下函数用于获取元素在屏幕上占用空间的实际大小
*   elementHeight(el)
*   elementWidth(el)
*   elementRect(el)
*
* 以下函数用于计算元素的相对位置
*   offsetBy(el, type)
*
* 以下函数用于获取群组元素的位置及大小。其中，bound是指
* 相对于body client的边界, 是一个{left, top, right, bottom}格式的对象
*   getGroupBound(elements)
*
**********************************************************************************************/

function elementHeight(el) {
  with (el.getBoundingClientRect()) return bottom-top;
}

function elementWidth(el) {
  with (el.getBoundingClientRect()) return right-left;
}

function elementRect(el) {
  var r = el.getBoundingClientRect();
  var w = r.right-r.left, h = r.bottom-r.top;

  r.left -= el.clientLeft;
  r.top -= el.clientTop;
  r.right = r.left + w;
  r.bottom = r.top + h;

  return r;
}

// 使用style的pixelLeft,pixelTop, pixelWidth, pixelHeight属性来计算
// 所有元素的style.position均为absolute;
function getGroupBound(all) {
  var r={left:Number.MAX_VALUE, top:Number.MAX_VALUE, right:Number.MIN_VALUE, bottom:Number.MIN_VALUE};
  for (var el, i=0, len=all.length; i<len; i++) {
    el = all[i];
    r.left = Math.min(r.left, el.style.pixelLeft);
    r.top = Math.min(r.top, el.style.pixelTop);
    r.right = Math.max(r.right, el.style.pixelLeft + el.style.pixelWidth);
    r.bottom = Math.max(r.bottom, el.style.pixelTop + el.style.pixelHeight);
  }
  return r;
}

// 取元素的相对位置.(left or top)
//  1. 如果el不是this的owner element(或el==null), 则将溯源到window的外边界, 并返回this->body之间的offset_Type值
//  2. 如果el指向body, 则将计算在界面上的相位置. 由于(通常)body相对于windows在(2,2), 因此body与null相差为2px;
function offsetBy(el, type) {
  if (this===el) return 0;
  var v=999, owner=this, border='client'+type;
  type = 'offset'+type;

  do {
    v += owner[type];
  } while ((owner=owner.offsetParent) && owner!==el && (v+=owner[border]))

  // v的初值为999, 这里减999修正
  // (以v=999为初值, 可以避免在第一次循环时因为offsetParent无边框而导致v+=parnet[border]为0, 从而使循环意外中止)
  // (注：测试发现, parnet[border]可能的值会包括：0, -1. 这给一些运算带来了麻烦)
  return v-999;
}

/*********************************************************************************************
*
* event处理的相关函数
*
* cancelEvent() : "哑"的事件句柄
*
**********************************************************************************************/

function cancelEvent() {
  return (!(window.event.cancelBubble=true))
}

function cancelEvent2() {
  return (window.event.cancelBubble=true)
}

function getEventX(el) {
  return window.event.offsetX + offsetBy.call(window.event.srcElement, el, 'Left');
}

function getEventY(el) {
  return window.event.offsetY + offsetBy.call(window.event.srcElement, el, 'Top');
}

/*********************************************************************************************
*
* Collections处理的相关函数

* coll2array : 返回一个数组对象, 包含入口的coll对象中的全部元素.
*
**********************************************************************************************/
function coll2array(coll) {
  if (coll) {
    if ('tagName' in coll) return [coll];
    for (var i=0, len=coll.length, arr=new Array(len); i<len; i++) arr[i]=coll[i];
    return arr;
  }
  return null;
}

/*********************************************************************************************
*
* DOM处理的相关函数

* appendElement : 向Document中增加一个元素, 返回该元素
* warpUpChild : 将warp套在el外面, 然后再插入到el的原来位置
**********************************************************************************************/

function appendElement(el) {
  switch (_DOC.readyState) {
    case 'uninitialized' : $assert(flase, 'hi, can\'t do anythings at document uninitialized'); return;
    case 'interactive':
    case 'loading' : _DOC.writeln(el.outerHTML); return _DOC.getElementById(el.id);
    default : _DOC.body.appendChild(el); return el;
  }
}

function warpUpChild(el, warp) {
  var to, node, isSib=false, owner=el.parentElement;
  if (node=el.nextSibling) 
    isSib = true;
  else
    node = owner;

  owner.removeChild(el);
  warp.appendChild(el);
  if (isSib)
    node.insertAdjacentElement('beforeBegin', warp);
  else
    owner.appendChild(warp);
}

$import.setActiveUrl("Components/Controls/HtmlController.js");
/*****************************************************************************
*
* Qomo 组件包 - HTML元素控制器 THtmlController
*
* THtmlController用于控制DOM中的 HTML对象(Element)或 DHTML对象(Node), 提供一个
* 在 Qomo OOP中操作这些对DOM对象的标准界面.
*
* THtmlController提供对DOM对象中的事件的钩挂函数, 这样可以使用Qomo OOP中的Event
* 对象来接管DOM中的事件.
*
* DOM中的HTML Attributes(HTML标签属性)、Properties(DOM属性)、Collections(收集器)
* 都将作为特性值处理, 可以使用get()/set()来访问.
*
* 在调用创建对象实例前, DOM对象必须是已经可以访问的. 这意味着THtmlController是在
* Create()期间早绑定Element的.
*
*
* 作为一项基本约定，HTMLController及其子类不对元素的属性和特性进行修改，它只用
* 于对元素的表达效果作为实现：例如将窗体表达为窗体。但不会动态效果做设计：例如
* 移动窗体由TMoveable来实现。
*
*****************************************************************************/

var
  EAssignTargetNoExist = [8301, '试图将控件assign()到一个不存在的目标(元素或对象)上.'];
  TOnAssigned = function (el) {};

function HtmlController() {
  var _DOM_Elem = '_DOM_Element';

  // 一个指向被绑定元素的特性, 它是被保护的, 不能够直接访问
  Attribute(this, _DOM_Elem, null, 'p');
  
  // 一个标识控件是否直接Create()期间即时绑定元素的特性. 它只能在类注册过程中通过_set()来置值.
  Attribute(this, 'ImmediateBind', true, 'r');

  // 用于钩住HTML Element的事件句柄
  this.hookEvents = function() {
    var args = arguments, events = ((args.length==1) && (args[0] instanceof Array)) ? args[0]:args;
    var DOM = this.get(_DOM_Elem);
    hookHtmlEvents.call(this, DOM, events);
  }

  this.OnAssigned = TOnAssigned;
  this.assign = function(Id, byName, subIndex) {
    var el = Id;
    if (typeof Id == 'string') {
      if ((arguments.length==2) && byName) subIndex = 0;
      el = (byName) ? _DOC.getElementsByName(Id)[subIndex] : _DOC.getElementById(Id);
    }
    this.set(_DOM_Elem, el);
    this.assignedElement = el;
    this.OnAssigned(el);
  }

  var _AttrProviderReplace = function() {
    var $get = this.get;
    var $set = this.set;
    var $all = Interface.QueryInterface(this, IAttributes);

    // rewrite get/set to access DOM
    this.get = function(n) {
      if (arguments.length==0) return $get.call(this);

      var el, v;
      if (!$all.names(n) && (el=$get.call(this, _DOM_Elem))) {
        var v = el.getAttribute(n, 1);
        if (v !== null) return v;  // is DOM's Attribute
        if (n in el) return el[n]; // is Element Object's property
      }
      // is Qomo's Attributes, if isn't, $get() will throw a exception
      return $get.call(this, n);
    }

    this.set = function(n, v) {
      if (arguments.length==1) return $set.call(this, arguments[0]);

      // check old attribute value
      switch ($get.call(this, n)) { // attr from Qomo's framework
        case v : return;
        case undefined : {
          var el = $get.call(this, _DOM_Elem);
          if (n in el) return void(el[n] = v);
          if (el.getAttribute(n, 1) !== null) return void(el.setAttribute(n, v));
        }
        default :
          $set.call(this, n, v);
      }
    }
  }

  this.Create = function(Id, byName, subIndex) {
    // replace once only!
    _AttrProviderReplace.call(this);
    // assign within create()
    if (arguments.length>0) this.assign.apply(this, arguments);
    // replace the create() method
    this.Create = this.assign;
  }
}

// 为THtmlController及其所有子类的初始化建立切面
void function() {
  var asp = new CustomAspect(Class, 'THtmlController_SubClass_Init', 'Initialized')
  asp.OnIntroduction.add(function(cls, n, p, a) {
    do { if (cls.ClassName=='THtmlController') return } while (cls=cls.ClassParent);
    return false;
  });
  asp.OnBefore.add(function(cls, n, p, a) {
    var Intfs = Aggregate(cls.Create, IAttrProvider);
    var intf = Intfs.GetInterface(IAttrProvider);
    var has = intf.hasAttribute;
    var hasOwn = intf.hasOwnAttribute;
    // parament "t" in [0, 1, 2, r, w, *]
    intf.hasAttribute = function(n, t) {
      var t2 = ('rw*'.indexOf(t)>-1 ? 0 : parseInt(t));
      return (this.assignedElement.getAttribute(n, t2) !== null ? true : has.apply(intf, arguments))  
    }
    intf.hasOwnAttribute = function(n, t) {
      var t2 = ('rw*'.indexOf(t)>-1 ? 0 : parseInt(t));
      return (this.assignedElement.getAttribute(n, t2) !== null ? true : hasOwn.apply(intf, arguments))  
    }
  });
}();

// 类注册
THtmlController = Class(TObject, 'HtmlController');
__DOC = THtmlController.Create(window.document);
$import.setActiveUrl("Components/Controls/HtmlComponent.js");
/*****************************************************************************
*
* Qomo 组件包 - HTML组件基类 THtmlComponent
*
*****************************************************************************/

function HtmlComponent() {
  var _CLS_Custom = ['onmouseenter', 'onmouseleave', 'onmouseonwn', 'onmouseup', 'onkeyonwn', 'onkeyup'];

/*
// 1. #<id>:<v_cls>
// 2. <tagName>:<v_cls>
// 3. .<clsName>:<v_cls>
<-- dynamic style -->
<selector>:v_cls {

}
*/

/*
  function _applyDynStyle(el, styName) {

    // 添加Dynamic Style中的伪类句柄
    for (var n,i=0; i<_IMAX; i++) {
      n = _CLS_Custom[i];
      if (el[n]) {
        el[n] = new MuEvent(el[n], _CLS[n]);
        el[n].close();
      }
      else {
      	el[n] = _CLS[n];
      }
    }
    this.hookEvents(_CLS_Custom);

    // find element
    // get style rule
    // rule.apply(el);
  }
  function _domouseenter() {
    _applyDynStyle(this.assignedElement, 'mouseenter');
  }
  function _domouseleave() {
    _applyDynStyle(this.assignedElement, 'mouseleave');
  }
  function _domousedown() {
    _applyDynStyle(this.assignedElement, 'mousedown');
  }
  function _domouseup() {
    _applyDynStyle(this.assignedElement, 'mouseup');
  }
  function _dokeydown() {
    _applyDynStyle(this.assignedElement, 'keydown');
  }
  function _dokeyup() {
    _applyDynStyle(this.assignedElement, 'keyup');
  }

  var _CLS={}, _IMAX=_CLS_Custom.length;
  void function() {
    for (var n, i=0; i<_IMAX; i++) {
      n = _CLS_Custom[i];
      _CLS[n] = eval(n.replace(/^on/, '_do');
    }
  }();
*/

  // 处理Attributes初始值, 使HTML标签上的attribute值影响到对象(触发器)
  var resetAttributes = function(el) {
    var IAttr = Interface.QueryInterface(this, IAttributes);
    var all = [];
    for (var i=0, imax=IAttr.getLength(); i<imax; i++) {
      with (IAttr.items(i)) {
        if (tags.indexOf('w') > -1) all.push(name);
      }
    }

    for (var v, i=0; i<all.length; i++) {
      // getAttribute() returns a String, number, or Boolean value as defined by the attribute.
      // If the attribute is not present, this method returns null.
      if (!el['getAttribute'] || (v=el.getAttribute(all[i], 1))===null) continue;

      if (!isNaN(v))
        this.set(all[i], parseInt(v));
      else switch (v.toLowerCase()) {
        case 'false': this.set(all[i], false); break;
        case 'true': this.set(all[i], true); break;
        default:
          this.set(all[i], v);
      }
    }
  }

  doAssigned = function(Id, byName, subIndex) {
    el = this.assignedElement;
    resetAttributes.call(this, el);
    // applyDynamicStyle(this, el);
  }

  this.Create = function() {
    this.OnAssigned.add(doAssigned);
    this.inherited();
  }
}

THtmlComponent = Class(THtmlController, 'HtmlComponent');
$import.setActiveUrl("Components/Controls/HtmlTemplet.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.05.14]

 HtmlTemplet for Qomo's UI Framework layer.
*****************************************************************************/


/**
 * Class HtmlTemplet
 *  - you can't read
 */
function HtmlTemplet() {
  Attribute(this, 'TempletContext', '<%tagName% id="%id%" class="%className%"%Attributes%></%tagName%>');
  Attribute(this, 'tagName', '', 'r');
  Attribute(this, 'id', '', 'rw');

  this.getAttributes = function() {
    var v = this.get();
    return (!v ? '' : ' ' + (v instanceof Array ? v.join(' ') : v.toString()));
  }

  this.Create = function(ctrl) {
    if (ctrl && !(ctrl instanceof HtmlController)) throw new Error();
    this.inherited();
  }
}


/**
 * Class InlineTemplet
 *  - SPAN is a inline element
 */
function InlineTemplet() {
  _set('tagName', 'SPAN');
}


/**
 * Class BlockTemplet
 *  - DIV is a block element
 */
function BlockTemplet() {
  _set('tagName', 'DIV');
}


/**
 * Class BlockTemplet
 *  - for BR, INPUT and more
 */
function TagTemplet() {
  _set('TempletContext', '<%tagName% id="%id%" class="%className%"%Attributes% />');
}

/**
 * Components Templet
 *  - for all Qomo's Components.
 */
function ComponentTemplet() {
  this.getDefaultClassName = function() {
    return 'Css'+this.ClassInfo.ClassName.replace(/^.*?_/, '');
  }

  this.Create = function(id) {/* a Id or instance of THtmlController */
    if (id && (typeof id=='string' || id instanceof String)) {
      this.set('id', id);
      this.inherited('Create', new CustomArguments());
    }
    else {
    	this.inherited();
    }
  }
}

THtmlTemplet = Class(TTemplet, 'HtmlTemplet');
TInlineTemplet = Class(THtmlTemplet, 'InlineTemplet');
TBlockTemplet = Class(THtmlTemplet, 'BlockTemplet');
TTagTemplet = Class(THtmlTemplet, 'TagTemplet');
TComponentTemplet = Class(TBlockTemplet, 'ComponentTemplet');
$import.setActiveUrl("Components/Controls/BaseControl.js");
/*****************************************************************************
*
* Qomo 组件包 - 基础控件 TBaseControl
*
* TBaseControl用于实现能够置放到Document上的基础控件类. 提供的基本特性包括大小、
* 位置、可视性、样式特性与样式类、流化(输出到Document或取实时HTML)。
*
* TBaseControl用于控制既有的HTML元素
*
* TBaseControl的另一重要特性是assign，任何一个基于BaseControl所实现的控件都必须
* 在assign()方法中实现将自己输出到"承载控件"的功能。如果调用assign()时不传入参
* 数, 则BaseControl为主动地使用BaseControl.id属性来创建一个DIV, 并添加到DOCUMENT
* 中, 这个DIV将起到承载器的作用。
*
* 控件被assign()到承载器之前，只是一个数据体; assign()使它关联于一个对象. 通常
* 是承载器, 或一个在承载器中新创建的html元素(element).
*
* 承载器不等于容器.
*
* (默认情况下, )BaseControl是晚绑定element的. 因此这也意味着在assign之前, 一些
* 与element有关的方法/属性的访问是无意义的(甚至可能导致出错).
* 
*****************************************************************************/

function BaseControl() {
  _set('ImmediateBind', false);

  this.assign = function (el) {  // el可以是元素对象, 或其ID
    if (arguments.length == 0) {
      el = _DOC.createElement('DIV');
      el.id = this.id;
      el = appendElement(el);
    }
    else {
      if (typeof el == 'string') el=_DOC.getElementById(el);
      if (!el) throw new Error(EAssignTargetNoExist);
    }

    this.name = el.name;
    this.id = el.id;
    this.inherited();
  }

  this.toString = function() {
    return el.outerHTML;
  }
}
TBaseControl = Class(THtmlController, 'BaseControl');
$import.setActiveUrl("Components/Controls/Drag.js");
/*TODO: 修改该单元的实现方案

  在Document一层处理的MOUSE事件
    - 对于Draging来说, 同时仅有一个可操作对象:
         如果GLOBAL.Selector为true, 则操作Selector; 否则
         操作GLOBAL.draging.
    - 对于zooming来说, 操作规则与Draging类似. 识别是Zooming还是Draging的标识是鼠标
      当前的形状. 因此, 在用户控件中要使系统改变(当前所选择的控件的)大小, 只需要调
      整鼠标的形状态即可.

    - Selector的mouseup会由它自身响应并处理, 在DOC一级不需要处理它.

    - 在DOC一级的draging和zooming仅处理一个对象. 因此如果要使对象能成批拖动或缩放,
      那只能使用Selector. 然而Selector必须依赖于一个DIV, 因此这表明只有在DIV中的对
      象可以成批地做Drag和Zoom(尽管Selector的确可以关联到非DIV元素, 但我一再强调应
      当使用DIV).

  Draging和Zooming两种行为的控制, 是用户控件与_DOC上的事件响应例程共同作用的结果.
*/

if (!document.all) {
  $debug('sorry, Drag.js unit for IE only...', '<BR>')
}
else {
  initEvents(_DOC, ['onmouseup', 'onmousemove', 'onmousedown', 'onmouseover', 'onmouseout']);

  _DOC.onmousedown.add(function() {
    GLOBAL.lastX = window.event.screenX;
    GLOBAL.lastY = window.event.screenY;
  });

  _DOC.onmouseup.add(function() {
    GLOBAL.draging = null;
    GLOBAL.zooming = null;

    if (GLOBAL.lastCursor!==null) {
      _DOC.body.style.cursor=GLOBAL.lastCursor;
      GLOBAL.lastCursor=null;
    }
  });

  _DOC.onmousemove.add(function() {
    with (GLOBAL) {
      var sor, el, i, e=window.event, x=e.screenX - lastX, y=e.screenY - lastY;
      if (el=draging) {
        el.style.pixelLeft += x;
        el.style.pixelTop += y;
      }

      if (zooming===null) {
        if (GLOBAL.lastCursor !== null) {
          _DOC.body.style.cursor = GLOBAL.lastCursor;
          GLOBAL.lastCursor = null;
        }
      }
      else {
        if ((sor=document.body.style.cursor) && (el=zooming)) {
          switch (sor) {
            case 'e-resize' : el.style.pixelWidth += x; break;
            case 's-resize' : el.style.pixelHeight += y; break;
            case 'nw-resize': el.style.pixelWidth += x; el.style.pixelHeight += y; break;
          }
        }
      }

      lastX = window.event.screenX;
      lastY = window.event.screenY;
    }
  });
}
$import.setActiveUrl("Components/Controls/BasePanel.js");
/*****************************************************************************
*
* Qomo 组件包 - 基础控件 TBasePanel
*
* TBasePanel用于实现一个容器控件. 基于HTML的一些特性, BasePanel可以包含一些子控
* 件. 除此之外, BasePanel还用实现了基本的鼠标处理例程, 以实现拖放和缩放操作等.
*
* Panel的真正意思在于它在界面上呈现为一个块。至于是用什么HTML标签实现的并不重要.
*
*****************************************************************************/

function BasePanel() {
  Attribute(this, 'CanDrop', false, 'rw');
  Attribute(this, 'CanResize', false, 'rw');
  Attribute(this, 'flatDrop', true, 'rw');
  Attribute(this, 'DropInOwner', false, 'rw');
  Attribute(this, 'ZoomRectCursor', '', 'rw');
  
  this.setCanDrop = function(v) {
    var css=this.get('style');
    if (v && css.position!='absolute') {
      css.position = 'absolute';
    }
    this.set(v);
  }

  this.getMoving = function() {
    return (this.assignedElement === GLOBAL.draging)
  }
  
  this.getResizing = function() {
    return (this.assignedElement === GLOBAL.zooming)
  }

  var doMouseDown_Drag = function() {
    var el=this.assignedElement;
    if (el) {
      if (this.get('ZoomRectCursor') && (!this.get('Resizing'))) {
        GLOBAL.zooming = el;
      }
      else if (this.get('CanDrop') && (!this.get('Moving'))) {
        GLOBAL.draging = el;

        if ((this.get('flatDrop')===true) && (el.style.zIndex!=10002)) {
          this.set('flatDrop', el.style.zIndex);
          el.style.zIndex = 10002;
          GLOBAL.zManager.add(el);
        }
      }
    }
    GLOBAL.lastX = window.event.screenX;
    GLOBAL.lastY = window.event.screenY;
  }

  var doMouseUp_Drag = function() {
    var el = this.assignedElement;
    if (el.style.zIndex==10002) {
      GLOBAL.zManager.remove(el);
      el.style.zIndex = this.get('flatDrop');
      this.set('flatDrop', true);
    }
  }

  // 接管DropInOwner=true方式下的鼠标移动
  var doMouseMove_Drag = function() {
    if (!(this.assignedElement && this.get('DropInOwner'))) return;

    var src=this.assignedElement, style=src['style'], e=window.event;
    if (this.get('Moving')) {
      if (style && this.get('CanDrop')) {
        var
          x = style.pixelLeft + e.screenX - GLOBAL.lastX,
          y = style.pixelTop + e.screenY - GLOBAL.lastY,
          p = src.parentElement,
          r = {l:x, t:y, w:style.pixelWidth, h:style.pixelHeight},
          cr = {l:0, t:0, w:p.clientWidth, h:p.clientHeight};

        style.left = x;
        style.top  = y;
        if (r.l<=cr.l) style.left = 0;
        if (r.t<=cr.t) style.top = 0;
        if (r.l+r.w>=cr.w) style.left = cr.w-r.w;
        if (r.t+r.h>=cr.h) style.top = cr.h-r.h;
        
        GLOBAL.lastX = e.screenX;
        GLOBAL.lastY = e.screenY;
        e.cancelBubble = true;
      }
    }
  }

  var doAdjustZoomRectCursor = function() {
	  if (!this.get('CanResize')) return;
	  var e=window.event, el=this.assignedElement;
	  if (!el || el!=e.srcElement) return;

    var
      r=elementRect(el),
      x=e.screenX-_DOC.body.clientLeft,
      y=e.screenY-_DOC.body.clientTop,
      rbw = 12,
      sor = (y>(r.bottom-rbw)) ? 's' : '';
    if (x>(r.right-rbw)) sor = (sor) ? 'nw':'e';

    // 在移动和缩放操作进行中, 不修正鼠标; 否则进行鼠标重设.
    if (GLOBAL.zooming===null && GLOBAL.draging===null) {
      this.set('ZoomRectCursor', sor);
      if (GLOBAL.lastCursor===null) GLOBAL.lastCursor = _DOC.body.style.cursor;
      _DOC.body.style.cursor = ((sor!='') ? sor + '-resize' : '');
      e.cancelBubble = true;
    }
  }

  this.assign = function(el) {
    this.inherited();
    
    // 使被绑定控件可以移动(position='absolute')
    if (this.get('CanDrop')) this.set('CanDrop', true);

    // 钩挂事件
    this.hookEvents(['onmousedown', 'onmousemove', 'onmouseup']);
    this.onmousedown.add(doMouseDown_Drag);
    this.onmouseup.add(doMouseUp_Drag);
    this.onmousemove.add(doAdjustZoomRectCursor);
    this.onmousemove.add(doMouseMove_Drag);
  }

  this.Create = function() {
    this.inherited();
  }
}
TBasePanel = Class(TBaseControl, 'BasePanel');
$import.setActiveUrl("Components/Controls/BaseList.js");
/*****************************************************************************
*
* Qomo 组件包 - 基础控件 TBaseList
*
* List是指呈列向显示的一个界面控件集。除列向显示外，List本身没有其它特别的含义。
* List用于列向显示时的一些控制，而非实现(或界面呈现)。
*
*****************************************************************************/

var
  TOnItemDraw = function(item) {};

function BaseList() {
  Attribute(this, 'Count', 0);
 
  var doDraw = function () {
    for (var i=0, items=this.items; i<items.length; i++)
      this.OnItemDraw(items[i]);
  }

  var doRedraw = function () {
    this.set('innerHTML', '');
    this.draw();
  }

  this.getCount = function () {
    return this.items.length;
  }
  
  this.setCount = function (v) {
    var i, items=this.items, item=['', ''];
    for (i=items.length; i<v; i++) items.push(item);
  }

  this.draw = doDraw;

  // 画每一个Item
  this.OnItemDraw = Abstract;
  
  this.Create = function() {
    this.inherited();

    this.redraw = doRedraw; // <--对象方法, 子类不可继承或重写
    this.items = [];        // <--element must array! the array[0] must 'name' or 'text' field
  }
}
TBaseList = Class(TBaseControl, 'BaseList');
$import.setActiveUrl("Components/Controls/TableList.js");
/*****************************************************************************
*
* Qomo 组件包 - 基础控件 TTableList
*
* 用Table标签实现的List组件
*
*****************************************************************************/

var
  EAssignTargetTypeError = [8302, '试图将控件assign()到一个类型不正确的目标(元素)上.'];

function TableList() {
  this.OnItemDraw = TOnItemDraw;

  var doItemDraw = function(item) {
    var text=item[0], url=item[1];
    var tr = this.get('insertRow')();
    var td = tr.insertCell();

    if (text) {
      if (typeof url!='function')
        td.innerHTML = (!url) ? text : text.link(url);
      else {
        // url is a function()
        var a = _DOC.createElement('A');
        a.href = '#';
        a.innerHTML = text;
        a.onclick = url;
        td.appendChild(a);
      }
    }
  }

  this.assign = function(el) {
    if (!el) {
      el = _DOC.createElement('TABLE');
      el.id = this.id;
      _DOC.appendChild(el);
    }
    else {
      if (el.tagName != 'TABLE') throw new Error(EAssignTargetTypeError);
    }

    this.inherited();
  }

  this.Create = function() {
    this.inherited();
    this.OnItemDraw.add(doItemDraw);
  }
}
TTableList = Class(TBaseList, 'TableList');
$import.setActiveUrl("Components/Controls/OutbarList.js");
/*****************************************************************************
*
* Qomo 组件包 - 仿outlook的OutbarList控件
*
* 实现Outbar的显示、管理和界面操作. 但每一个Bar中的显示内容, 是由调用代码自己负
* 责的.
*
* 本控件不负责Bar中的button的显示和控制.
*
* 每个Bar(页,Page)是由DIV来实现的. assign操作将Outbar的全部页添加到指定的DIV。
* 目标DIV应该是已存在的, 它的大小决定了bar所存在的空间、位置和滑动的范围.
*
*****************************************************************************/

var
  TOnItemContextDraw = function(el, item) {};
  
function OutbarList() {
  this.OnItemDraw = TOnItemDraw;
  this.OnItemTitleDraw = this.OnItemBodyDraw = TOnItemContextDraw;
  
  Attribute(this, 'BarHeight', 20, 'rw');
  Attribute(this, 'ShowingCount', null);

  this.getShowingCount = function() {
    for (var c=len=this.get('Count'),i=0; i<len; i++)
      if (this.findBartitleElement(i).style.display != '') c--;

    return c;
  }

  var findElementByIdExt = function(el, IdExt, subIndex) {
    return (isNaN(subIndex) ? el.children(el.id+IdExt) : el.children(el.id+IdExt, parseInt(subIndex)));
  }

  var doItemTitleDraw = function(el, item) {
    el.innerHTML = '<img src="%s" border=0>%s'.format(item[1], item[0]);
  }

  var doItemDraw = function(item) {
    var text =item[0], icon=item[1];
    var title = _DOC.createElement('DIV');
    var body = _DOC.createElement('DIV');

    title.id = this.id + '_title';
    title.className = 'OutbarList_title';
    title.style.pixelHeight = this.get('BarHeight');

    body.id = this.id + '_body';
    body.className = 'OutbarList_body';
    body.style.overflowY = 'hidden';
    body.style.display = 'none';
    body.height = 0;

    title.style.position = body.style.position = 'relative';

    this.assignedElement.appendChild(title);
    this.OnItemTitleDraw(title, item);
    this.assignedElement.appendChild(body);
    this.OnItemBodyDraw(body, item);
    
    // by default, if body is null, hide it.
    if (body.innerHTML == '')
      title.style.display = 'none';
  }

  var doMouseDown = function() {
    // check re-enter.
    if (this.currentIndex == -1) return;

    var
      el = window.event.srcElement,
      assEl = this.assignedElement,
      titleId = assEl.id + '_title';

    var
      isTitle = el.id==titleId,
      isBody =  el.id==assEl.id + '_body';

    if (!isTitle && !isBody) return;

    // is expanded, return
    var oldEl = this.findBartitleElement(this.currentIndex);
    if (oldEl==el) return;

    // init variants
    var
      idx = 0,
      body1 = oldEl.nextSibling,
      body2 = el.nextSibling;
    while (el = el.previousSibling) if (el.id==titleId) idx++;

    // create time provider
    var provide = TYuiSteper.Create();
    provide.set('From', body1.style.pixelHeight);
    provide.set('To', 0);
    provide.set('Frames', 10);

    // create timer
    var timer = TTimeline.Create(this, function(step, data) {
      var last = body1.style.pixelHeight;
      body1.style.pixelHeight = data = parseInt(data);
      body2.style.pixelHeight += last-data;
      body2.style.display = '';

      if (data==0) {
        body1.style.display = 'none';
        this.currentIndex = idx;
        timer.stop();
      }
    });

    this.currentIndex = -1;
    timer.start(provide, 50);
  }

  var getIndexByName = function(n) {
    for (var i=0,imax=this.items.length; i<imax; i++)
      if (this.items[i][0]==n) return i;
  }

  // i : number of index
  //   : string of name(text)
  this.findBartitleElement = function(i) {
    if (typeof i=='string') i=getIndexByName.call(this, i);
    return findElementByIdExt(this.assignedElement, '_title', i);
  }

  this.findBarbodyElement = function(i) {
    if (typeof i=='string') i=getIndexByName.call(this, i);
    return findElementByIdExt(this.assignedElement, '_body', i);
  }

  this.hidePage = function(i) {
    if (typeof i=='string') i=getIndexByName.call(this, i);
    var title=this.findBarbodyElement(i), body=this.findBarbodyElement(i);
    
    title.style.display = 'none';
    body.style.display = 'none';
  }

  this.isVisible = function(i) {
    return this.findBartitleElement(i).style.display=='';
  }

  this.draw = function() {
    this.inherited();

    var c = this.get('Count');
    var i = (this.currentIndex<0) ? this.currentIndex=0 :
            (this.currentIndex>=c) ? this.currentIndex=c-1 :
            this.currentIndex;
    if (!this.isVisible(i)) {
      for (i=0; i<c; i++) if (this.isVisible(i)) break;
      if (i!=c)
        this.currentIndex = i;
      else {
        this.currentIndex==-1;  // none visible page
        return;
      }
    }

    with (this.findBarbodyElement(i).style) {
      pixelHeight = this.assignedElement.clientHeight - this.get('ShowingCount')*this.get('BarHeight');
      display = '';
    }
  }
  
  this.assign = function(el) {
    this.inherited();

    this.hookEvents(['onmousedown']);
    this.onmousedown.add(doMouseDown);
  }

  this.Create = function() {
    this.inherited();

    this.OnAssigned.add(function(el) { 
      this.currentIndex = 0;
      this.OnItemDraw.add(doItemDraw);
      this.OnItemTitleDraw.add(doItemTitleDraw);
    });
  }
}
TOutbarList = Class(TBaseList, 'OutbarList');
$import.setActiveUrl("Components/Controls/TopoLogic.js");
/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.09.15]

 UI Library: TTopoLogic Component
*****************************************************************************/

// 0. 遍历arr[]的各结点, 创建索引
//    arr[]数组会被以arr[n][k]元素大小正向排序. 操作的结果是数组将会成为排序的.
function getNodesIndex(arr, k) {
  arr.sort(function(n1, n2) {
    return n1[k] - n2[k];
  });

  if (arr.length==0) return;
  for (var i=0, v=arr[0][k], r=[0]; i<arr.length; i++) {
    if (arr[i][k] != v) r.push(i);
    v = arr[i][k];
  }
  r.push(arr.length);
  return r;
}

// 1. 生成Topo的排序数组
function genNodesTopo(nodes, idx, kp, kn) {
  var i, l, r, n, topo=new Array(idx.length-1);
  var sortTopo = function(n1, n2) {
    return ((n1[kp]>n2[kp]) ? 1 : (n1[kp]<n2[kp]) ? -1 :
           ((n1[kn]>n2[kn]) ? 1 : (n1[kn]<n2[kn]) ? -1 : 0))
  }

  for (i=0; i<topo.length; i++) {
    l=idx[i], r=idx[i+1];
    n=nodes.slice(l, r);  //直到r, 但不包括r
    n.sort(sortTopo);
    topo[i] = n;
  }

  return topo;
}

// 计算共n级的展开比例数组
function genUnwindScale(n) {
  var i, r=new Array(n);
  for (i=0; i<r.length; i++) r[i] = Math.pow(1.2, i);
  return r;
}

// 计算指定级的指定节点的位置(比例)
function getPostion(i, imax, level, Scales) {
  var Scale = Scales[level];
  return (i-imax/2) * Scale;
}

// 计算指定级全部结点的位置(比例)
function genPostion(nodes, level, Scales) {
  for (var i=0, imax=nodes.length-1, r=new Array(nodes.length), Scale=Scales[level]; i<=imax; i++)
    r[i] = (i-imax/2) * Scale;
  return r;
}

TopoLogic = function() {
  this.OnQueryLevelInfo = Abstract;
  this.OnDrawNode = Abstract;
  
  Attribute(this, 'Topo', null, 'rw');
  Attribute(this, 'Levels');
  Attribute(this, 'MiniCenterX', 200, 'rw');

  this.getLevels = function() {
    var topo = this.get('Topo');
    return ((!topo) ? -1 : topo.length);
  }

  this.calcScalesCenter = function (Scales, idx) {
    for (var n, w, left=0, lv=0; lv<idx.length-1; lv++) {
      w = this.queryW(lv);
      n = idx[lv+1] - idx[lv] - 1;  // <-- 计算该层上的节点数
      n = -n/2 * Scales[lv];        // <-- 计算 Scale[0]
      if (left>(n=(w+5)*n)) left=n; // <-- 计算结点0的位置, 并置新的left值
    }

    var x = this.get('MiniCenterX');
    return ((left>-x) ? x : parseInt(-left));
  }

  this.toString = function() {
    var topo = this.get('Topo');
    var str, lv, i, node, nodes, info={top:0, width:0, height:0};

    for (str='', lv=0; lv<topo.length; lv++) {
      this.OnQueryLevelInfo(lv, info);
      nodes = topo[lv];
      for (i=0; i<nodes.length; i++) {
        node = nodes[i];
        str += this.OnDrawNode(lv, info, i, node);
      }
    }
    return str;
  }

  this.draw = function () {
    document.writeln(this);
  }
  
  this.Create = function(nodes, Idx, kParent, kNode) {
    if (arguments.length==0) return;

    this.set('Topo', genNodesTopo(nodes, Idx, kParent, kNode));
    this.xunit =          // <-- x方向上的基本单位
    this.yunit =          // <-- y方向上的基本单位
    this.queryW =         // <-- 计算x方向上递增(减)量的算法函数
    this.queryH =         // <-- 计算y方向上递增(减)量的算法函数
    this.centerX = null;  // <-- x方向上的中心点
  }
}

TTopoLogic = Class(TObject, 'TopoLogic');


// Qomo's Framework Initialized. 
$import.OnSysInitialized();