_inline_object_aggregateInterfaceToClassRegister: {

  // register aggregated interfaces for the Class();
  var _ClassRegisterIntfs = Aggregate(_Class, IJoPoints, IClassRegister);
  var intf = _ClassRegisterIntfs.GetInterface(IJoPoints);
  intf.getLength = function() { return _joinpoints_.length }
  intf.items = function(i) { return _joinpoints_.items(i) }
  intf.names = function(n) { if (!isNaN(n)) return _joinpoints_[n] }
  var intf = _ClassRegisterIntfs.GetInterface(IClassRegister);
  intf.hasClass = function(n) { return !!(n.indexOf('.')>-1 ? eval(n) : CLASSINFO[n]) }

}