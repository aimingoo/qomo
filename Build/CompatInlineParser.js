function CompatInlineParser(ctx, urlBase) {
  // for single line inline/import only
  var _r_inline_code = / *\b(window\.)?eval\s*\(\s*(\$inline\s*\(.*\))\s*\)\s*[;\n]/g;
  var _r_import_code = /\n\s*\$import_*\s*\((.*)\)[;\n]+/g;
  var isCompatIE50 = $QomoConfig('Build/CompatIE50');
  var msieParseing = false;

  function tblReplace(ctx, tbl) {
    for (var i=0; i<tbl.length; i+=2) {
      str = ctx.replace(tbl[i], tbl[i+1]);
      if (ctx == str) $debug('invalid item in _rep_table[', i, ']');
      ctx = str;
    }
    return ctx;
  }

  var _r_msie = /common_msie\.js$/im;
  function msieParser(ctx) {
    try {
      // import compat code for version
      msieParseing = true;
      ctx = ctx.replace(_r_import_code, ctxReplace);
    }
    finally {
      msieParseing = false;
    }

    // clear other $import;
    ctx = ctx.replace(_r_import_code, '// removed: $1');
    return ctx;
  }

  var _r_msie6 = /common_ie6\.js$/im;
  function msie6Parser(ctx) {
    // for IE50 compat only
    if (isCompatIE50) {
      ctx = tblReplace(ctx, [
        'for (var key in value) {', 'for (var key in value) {\r\n      if ({}[key]) continue;'
      ]);
    }
    /* 'private_ie1.js', $Q('IeAabsolutePath') */
    /* 'private_ie2.js', $Q('IeDecode') */
    /* 'common_js16.js' */
    return ctx.replace(_r_import_code, ctxReplace);
  }

  var _r_mozold = /common_mozold\.js$/im;
  function mozoldParser(ctx) {
    return ctx.replace(_r_import_code, '// removed: $1');
  }

  function ctxReplace($0, $1) {
    // $1 isn't null, always
    var args = $1.split(',');
    if (args.length<2 || eval(args[1])) {
      var fn = urlBase + eval(args[0]);
      var ctx = $inline(fn);

      if (msieParseing) {
        // remove block comment in all sub-model 
        ctx = ctx.replace(/\/\*[\d\D]*?\*\//g, '');
      }

      return (
        _r_msie.test(fn) ? msieParser(ctx)
          : _r_msie6.test(fn) ? msie6Parser(ctx)
          : _r_mozold.test(fn) ? mozoldParser(ctx)
          : ctx
      )
    }
    else {
      return '// removed: ' + $1;
    }
  }

  while (_r_import_code.test(ctx)) {
    ctx = ctx.replace(_r_import_code, ctxReplace);
  }

  return ctx;
}