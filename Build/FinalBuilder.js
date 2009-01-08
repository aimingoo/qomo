_inline_building_builder_context: {

  var on_sys_initialized = '$import.OnSysInitialized();';
  var qomo_config = (new Function('var $Q, $QomoConfig; ' + $inline('../Qomo.Config.js') + '; return $QomoConfig'))();

  function push_header() {
    // hello, i'm aimingoo. ^.^
  }

  var ajaxBlock = [
    /function\s+Ajax\s*\([.\n)]*\)\s*\{/g,
    /return http[;\s]+\}/g
  ];

  var importBlock = [
    /\$import\s*=\s*function\s*\([.\n)]*\)\s*\{/g,
    /return _import[;\s]+\}\(\)[;\s]*/g
  ];

  var inlineBlock = [
    /\$inline\s*=\s*function\s*\([.\n)]*\)\s*\{/g,
    /[;\s]+\}\(\)[;\s]*/g
  ];
  var debugBlock = [
    /\$debug\s*=\s*function\s*\([.\n)]*\)\s*\{/g,
    /[;\s]+\}[;\s]*/g
  ];

  // code from JSEnhance.js
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

  function push_system() {
    var ctx = $inline('../Qomo.js');
    ctx = ctx.replace(on_sys_initialized, '');

    if ($QomoConfig('NoneAjax')) {
      ctx = _removeBlock.call(ctx, ajaxBlock, '// removed\n');
    }
    if ($QomoConfig('NoneImport')) {
      ctx = _removeBlock.call(ctx, importBlock, '// removed\n');
      ctx = _removeBlock.call(ctx, inlineBlock, '// removed\n');
    }
    if (!$QomoConfig('OutputDebug')) {
      ctx = _removeBlock.call(ctx, debugBlock, '$debug = function() { };\n');
    }
    builded.push(clearCode(ctx));
  }

  function push_system_patch() {
    if (!$QomoConfig('NoneImport')) {
      builded.push("void function () {\n" +
        "  var $setter = $import.set;\n" +
/* if need, you can put next line at here.
        "  var srcBase = '" + $import.get('srcBase') + "';\n" +
*/
        "  $import.setActiveUrl = function(url) {\n" +
        "    $setter('curScript', url);\n" +
        "  }\n" +
        "}();\n"
      );
    }
  }

  function unshift_config() {
    var ctx = '$Q = $QomoConfig = function(n) {\n  var conf = {\n' ;

    for (var n in qomo_config) {
      if (n == 'set') continue;
      ctx += '    "' + n + '": ' + $QomoConfig(n.replace(/^(has)|(is)/, '')).toString() + ',\n';
    }

    ctx = ctx.substr(0, ctx.length-2) + '\n' +
      '  };\n' +
      '  return (conf["is"+n] || conf["has"+n]);\n' +
      '}';

    builded.unshift(ctx);
  }

  function push_finished() {
    builded.push("\n\n// Qomo's Framework Initialized. ");

    if (!$QomoConfig('NoneImport')) {
      builded.push(on_sys_initialized);
    }
  }

  
  var _buildedCount = 0;
  var _builder = {
    buffer: builded,

    OnBuilding : function(url) {
      // hook without Qomo.js only.
      return true;
    },

    OnCompatLoaded: function(url) {
      return true;
    },

    OnClearCode : function(conf, url, ctx) {
      return ctx;
    },

    start: function() {
      push_header();
      push_system();
      push_system_patch();
    },

    finish: function(noConfig) {
      if (!noConfig) {
        unshift_config();
      }
      push_finished();
      return builded.join('\n');
    },

    report: function() {
      return {
        fileCount: _buildedCount
      }
    },

    saveToFile: function() { }
  }

  // bind _builder's event to builded-array.
  builded.OnQueryBuild = function(state) {
    _buildedCount++;
    
    var _r_compatlayer = /\/CompatLayer\.js/;
    if (!state.compatLayerLoading) {
      state.compatLayerLoading = _r_compatlayer.test(state.url);
    }
    else {
      // protect the property
      var url = state.url;
      if (!_builder.OnCompatLoaded(url)) {
        state.url = url;
        return false;
      }
      state.url = url;
      // clear loading state mark
      state.compatLayerLoading = false;
    }

    return _builder.OnBuilding(state.url);
  }

  builded.OnQueryCode = function(conf, state, ctx) {
    return _builder.OnClearCode(conf, state.url, ctx);
  }
}