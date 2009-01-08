// 工具: 取路径中的文件名
function FN(path) {
  //return path.substr(path.lastIndexOf('/')+1);
  return path.replace(/.*[\/\\]/, '');
}

// 加入profiler相关的代码($profilers是全局对象)
var asp_import = function() {
  var _setActiveUrl = $import.setActiveUrl; // get a reference.
  var _asp = new FunctionAspect($import, '$import', 'Function');

  // clone a custom method for $import;
  $import.setActiveUrl = function() {
    _setActiveUrl.apply(_asp.get('HostInstance'), arguments);
  };

  return _asp;
}();

asp_import.OnBefore.add(function(o, n, p, a) {
  with ($profilers(n, FN(a[0]))) {
    set('url', a[0]);
    a['$tag$'] = begin();
  }
});

asp_import.OnAfter.add(function(o, n, p, a, v) {
  $profilers(n, FN(a[0])).end(a['$tag$']);
});