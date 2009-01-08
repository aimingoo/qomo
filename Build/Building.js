/*****************************************************************************
Qomolangma OpenProject v2.0
  [Aimingoo(aim@263.net)]
  [2007.07.20]

 - Builder System
*****************************************************************************/

$import('CompatInlineParser.js');

$builder = function() {
  var $setter = $import.set;
  var $getter = $import.get;

  var decode = $getter('bodyDecode');
  var transitionUrl = $getter('transitionUrl');
  var isNamedSystem = $QomoConfig('Namespace');

  function _getBase() {
    return $getter('docBase') + $getter('srcBase');
  }

  // rewrite set&getter, protect transitionUrl and bodyDecode
  $import.get = function(n, v) {
    switch (n){
      case 'transitionUrl': return transitionUrl;
      case 'bodyDecode': return decode;
      default: return $getter.call(this, n);
    }
  }

  $import.set = function(n, v) {
    switch (n){
      case 'transitionUrl': transitionUrl = v; break;
      case 'bodyDecode': decode = v; break;
      default: $setter.call(this, n, v);
    }
    // reset current base, if docBase changed
    if (n=='docBase') {
      state.base = transitionUrl(_getBase());
    }
  }

  // for single line inline/import only
  var _r_inline_code = / *\b(window\.)?eval\s*\(\s*(\$inline\s*\(.*\))\s*\)\s*[;\n]/g;
  var _r_import_code = /\n(\s*\$import\s*\(.*\)[;\n]+)+/g;

  // check oop module loading.
  var _r_oop = /\/object\.js$/im;

  var scripts = $getter('scripts');
  var builded = [];
  var state = {
    OOP: false,
    url: '',
    base: _getBase(),
    compatLayerLoading: false,
    isInline: function() {
      return !(this.url in scripts);
    }
  }

  builded.OnQueryBuild = function(state) {
    // will replaceing in FinalBuilder.js
    return true;
  }
  builded.OnQueryCode = function(conf, state, ctx) {
    // will replaceing in FinalBuilder.js
    return ctx;
  }

  function _transitionUrl(url) {
    if (_r_oop.test(url)) {
      state.OOP = true;
    }
    return state.url = transitionUrl(url);
  }

  function clearCode(ctx) {
    // import code
    var S = '\n/* context imported... */\n';
    // inline code
    var R = function($0, $1, $2) {
      var code = eval($2);
      return (!code ? '' : code + '\n');
    }

    // protect the property
    var url = state.url;
    ctx = ctx.replace(_r_inline_code, R).replace(_r_import_code, S);
    state.url = url;

    return builded.OnQueryCode($QomoConfig, state, ctx);
  }

  // analyz code forword, now, it's for CompatLayer.js only(version info valid after module load).
  //  - if file is last load, processLastCode() will invalid, because none decode() fire it.
/* cancel -->
  function processLastCode() {
    if (builded.length < 2) return;

    // for CompatLayer.js only
    var _r_compatlayer = /\/CompatLayer\.js/;
    var FN = builded[builded.length-2];
    if (_r_compatlayer.test(FN) && $import.get) {
      // for CompatLayer laoder only.
      var _r_loader = /( *)\$import\.set\('browser', i\)[;\s]+/;
      var ver = $import.get('browser');
      var code = ['$&', 'if (i == "', ver, '") return;\n$1'].join('');
      builded.push(builded.pop().replace(_r_loader, code));
    }
  }
*/

  // hook decode(), for load module:
  //  - get all $import() and $inline() call
  //  - replace its for script context
  //  - discovery context, replace again.
  function _decode(ajx) {
    var ctx = decode(ajx);
    var url = $getter('curScript');  //<--- hello, what's this URL?!

    if (!state.isInline() &&
        builded.OnQueryBuild(state)) {
      // 1. process pushed code again.
      // processLastCode();

      // 2. push new_code's url
      //  - if none namespace, skip..
      //  - skip before process object.js
      var commented = (isNamedSystem && state.OOP ? '' : '//');
      var _url = (state.url.indexOf(state.base)==0 ? state.url.substr(state.base.length) : state.url);
      builded.push(commented + '$import.setActiveUrl("' + _url + '");');

      // reset curScript for inline code
      $setter('curScript', state.url);
      try {
        // 3. push new_code's context
        builded.push(clearCode(ctx));
      }
      finally {
        $setter('curScript', url);
      }
    }
    else {
      // skip $inline()...
    }
    return ctx;
  }

  $setter('transitionUrl', _transitionUrl);
  $setter('bodyDecode', _decode);

  // _builder defined in inline code.
  eval($inline('FinalBuilder.js'));

  return _builder;
}();

$builder.start();

/**
 * a new compat layer loadder
 */
void function() {
  // compat for IE5.0
  var __safe_caller = (function(foo, lv) {
    if (isNaN(lv = parseInt(lv))) lv=1;
    while (foo && lv>0) {
      while ((foo = foo.caller) &&
             ((foo == foo.apply) ||
              (foo == foo.call)  ||
              (foo.caller == foo.apply))) { /* null loop */ };

      lv--;
    }
    return foo;
  }).toString();

  var isCompatIE50 = $QomoConfig('Build/CompatIE50');
  var _r_backRuntime = /\/RTL\//;
  $builder.OnCompatLoaded = function(url) {
    // $debug(url, '<BR>');
    if (_r_backRuntime.test(url)) {
      var ctx = $inline('Compat/CompatInline.js');
      ctx = CompatInlineParser(ctx, 'Compat/');
      if (isCompatIE50) {
        ctx += '\n\n  __safe_caller = ' + __safe_caller;
      }
      $builder.buffer.push('//$import.setActiveUrl("Framework/RTL/CompatInline.js");');
      $builder.buffer.push(ctx);
      return true;
    }
    return false;
  }
}();

/**
 * some fiter for builder system
 */
void function() {
  var isCompatIE50 = $QomoConfig('Build/CompatIE50');
  var hasInterface = $QomoConfig('Interface');
  if (!isCompatIE50) return;

  var __diff_props = (
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
    }.toString(true) +
    function getDiffProperties(cls) {
      return getClassTypeinfo(cls).$diff_
    }.toString(true)
  );

  function tblReplace(ctx, tbl) {
    for (var i=0; i<tbl.length; i+=2) {
      str = ctx.replace(tbl[i], tbl[i+1]);
      if (ctx == str) $debug('invalid item in _rep_table[', i, ']');
      ctx = str;
    }
    return ctx;
  }

  var org_filter = $builder.OnClearCode;
  $builder.OnClearCode = function(conf, url, ctx) {
    // 1). process "for (var $1 in ...)"
    // var r1 = /for\s*\(\s*var\s+(\S+)\s+in\s+/g;
    // ctx = ctx.replace(r1, "var $1; for ($1 in ");

    // 2). replace Function.caller[[.caller]...]
    var r2 = /([\.\w\$]+?)((\.caller)+)/g;
    var len = ".caller".length;
    ctx = ctx.replace(r2, function($0, $1, $2, $3) {
      switch ($1) {
        case '_cls':
        case '_get':
        case '_set':
        case 'Attribute':
        case 'Constructor': return $0;
      }
      return '__safe_caller(' + $1 + ',' + $2.length/len + ')';
    });

    // 3). replace with table
    var _r_object = /\/Object\.js/;
    var _r_profilers = /\/Profilers\.js/;
    var _r_repimport = /\/RepImport\.js/;
    var _r_dbgutils =  /\/Dbg\.Utils\.js/;
    var _r_objutils =  /\/ObjUtils\.js/;
    var _r_interface =  /\/Interface\.js/;
    var _r_templet = /\/Templet\.js/;
    var _r_htmlutils = /\/HtmlUtils\.js/;
    var _r_htmltemplet = /\/HtmlTemplet\.js/;
    var _r_htmlcontroller = /\/HtmlController\.js/;

    var _rep_table = (hasInterface && _r_object.test(url)) ? [
      "function p_getAttr(n) {", "function p_getAttr(n) { return this.get();",
      "function p_setAttr(v, n) {", "function p_setAttr(v, n) { return this.set(v);",
      '{ return _r_event.test(n) && (n in this) }', '{ return _r_event.test(n) && (this[n] !== undefined) }',
      '{ return n in this }', '{ return this[n] !== undefined }',
      'return (n in _proto_ ? eval($cc_attr[t]) : false)', 'return ((_proto_[n] !== undefined) ? eval($cc_attr[t]) : false)'
    ]: (_r_object.test(url)) ? [
      // diffProperties In IE5, replace hasOwnProperty()
      "function ClassTypeinfo(cls, Attr) {", "function ClassTypeinfo(cls, diff, Attr) { this.$diff_ = diff;",
      "new ClassTypeinfo(cls, Attr)", "new ClassTypeinfo(cls, diff, Attr)",
      "if (p.hasOwnProperty(n)) a.push(p[n])", "if (getDiffProperties($cls).diffed.indexOf(n) > -1) a.push(p[n])",
      "cls = function (Constructor) {", "cls = function (Constructor) { var _diff=[];",
      "Attr.prototype = $Attr_", "Attr.prototype = $Attr_, _diff = $diff_",
      "var base = new Constructor()", "var diff = [], base = new Constructor()",
      "setClassTypeinfo(cls, base, Attr)", "diff.sort(); diff.diffed = diffProperties.apply(diff, [_diff, function(p) { return parent[p] === base[p] }]); setClassTypeinfo(cls, base, Attr, diff)",
      "/*IE5:CONTINUE*/", "continue",
      "/*IE5:DIFFPUSH*/", "diff.push(i);",
      "function setClassTypeinfo(", __diff_props +"function setClassTypeinfo(",
      // disable attribute protected
      "function p_getAttr(n) {", "function p_getAttr(n) { return this.get();",
      "function p_setAttr(v, n) {", "function p_setAttr(v, n) { return this.set(v);"
    ]: (_r_profilers.test(url)) ? [
      'return ((n in profs)', 'return ((profs[n] !== undefined)'
    ]: (_r_repimport.test(url)) ? [
      'if (url in cache)', 'if (cache[url] !== undefined)'
    ]: (_r_dbgutils.test(url)) ? [
      "if (!('$cached$' in arguments.callee))", "if (arguments.callee['$cached$'] === undefined)"
    ]: (_r_objutils.test(url)) ? [
      "return !(p in $o) && (p in o);", "return !($o[p] || o[p]===undefined);"
    ]: (_r_interface.test(url)) ? [
      '!("$$" in p2)', '(!p2["$$"]',
      '("$$" in p2)', 'p2["$$"]',
      '!(n in obj)', '!obj[n]'
    ]: (_r_htmlutils.test(url)) ? [
      "if ('tagName' in coll)", "if (coll['tagName'] !== undefined)"
    ]: (_r_htmlcontroller.test(url)) ? [
      'if (n in el)', 'if (el[n] !== undefined)',
      'if (n in el)', 'if (el[n] !== undefined)'
    ]: (_r_templet.test(url)) ? [
      '/\\%(.*?)\\%/gi', '/\\%([^\\%]*)\\%/gi',
    ]: (_r_htmltemplet.test(url)) ? [
      '/^.*?_/', '/^[^_]*_/',
    ]: new Array();

    ctx = tblReplace(ctx, _rep_table)

    // n). call next filter again
    return org_filter.apply($builder, [conf, url, ctx]);
  }
}();