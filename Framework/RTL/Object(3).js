_inline_object_aggregateInterfaceAfterClassRegistered: {

    // implement IAttributes
    var intf4 = _ConstructorIntfs.GetInterface(IAttributes);
    void function(){
      var length=0, all={}, P=getAttrPrototype(cls), Q=$cc_attr;
      for (var n in P) {
        if (P[n] instanceof Function) continue;
        all[length++] = all[n] = {
          name: n,
          tags: Q['*'](P, n) ? 'rw':
                Q['r'](P, n) ? 'r' :
                Q['w'](P, n) ? 'w' : ''
        }
      }

      intf4.getLength = function() { return length }
      intf4.items = function(i) { if (!isNaN(i)) return all[i] }
      intf4.names = function(n) { if (all.hasOwnProperty(n)) return all[n] }
    }();

}