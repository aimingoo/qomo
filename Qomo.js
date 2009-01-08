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
 * execScript method for window object, try to match what MSIE provided.
 * note codes here are designed to make Geckos prior to 1.8.0.1 not to crash,
 * but will cause compatiable issues and must be rewrited in CompatLayer
 */
if (window.execScript == null) {
  window.execScript = function(script, type) {
/*
  According to ECMA 262 Section 10.2.2, objects declared in eval() context
  don't have a {DontDelete} property, so we're calling that method of the
  window object. This works in Geckos at least prior to 1.7
  Keep a eye on this, since this will be changed in upcoming 2.0
  https://bugzilla.mozilla.org/show_bug.cgi?id=352045
 */
    window.eval(script);
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
      m, d = '/',
      p1 = (url.charAt(0)==d ? d : ''),
      p2 = (url.charAt(url.length-1)==d ? d : '');

    if (m = _r_protocol.exec(url)) {
      p1 = m[0];
      url = url.substr(p1.length);
    }

    for (var i=0, v=[], m=url.split(d); i<m.length; i++) {
      switch (m[i]) {
        case '..': v[(v.length>0 && v[v.length-1]!='..') ? 'pop' : 'push'](m[i]); // break defer
        case '.' :
        case ''  : break;
        default  : v.push(m[i]);
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

/**
 * import thirdparty code/package
 */
$import2 = function(src, prepare, patch, condition) {
  try {
    src = $inline.apply(this, (arguments.length<4 ? [src] : [src, condition]));
  }
  catch (e) {
    $debug('can\'t import thirdparty code/package[', src, '].<BR />');
    return;
  }

  $assert(src, 'can\'t import a null file or package.');

  var obj = (this == window ? {} : this);
  if (prepare) {
    src = prepare.toString() + src;
  }
  if (patch instanceof Function) {
    patch = '(' + patch.toString() + ').call(this);';
  }
  (new Function(src + '\n\r' + patch)).call(obj);
  return obj;
}

$import('Build/Default.Config.js');
$import('Build/Building.js', $Q('Building'));

// load system framework core
$import('Framework/system.js');

// load util or base classes.
$import('Framework/Classes.js', $Q('CommonClasses'));

// load components.
$import('Components/Components.js');

// sytem Initialized.
$import.OnSysInitialized();