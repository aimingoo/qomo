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