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
      var P = getAttrPrototype(cls);
      return (n in P && $cc_attr[t](P, n));
    }
    intf.hasOwnAttribute = intf2.hasOwnAttribute = intf3.hasOwnAttribute = function(n, t) {
      var P = getAttrPrototype(cls);
      return (P.hasOwnProperty(n) && $cc_attr[t](P, n));
    }
/*
    var intf = _ClassIntfs.GetInterface(IJoPoints);
    // TODO: implement the interfaces

    var intf = _ConstructorIntfs.GetInterface(IJoPoints);
    // TODO: implement the interfaces
*/

}