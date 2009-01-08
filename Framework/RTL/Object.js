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
  EWriteUndefinedAttr = [8110, 'Try write attribute [%s], but its undefined!'];
  EInvalidClass = [8111, 'Class or ClassName Invalid.'];
  ECreateInstanceFail = [8112, 'Create Instance fail.'];
  EAttributeCantRead = [8113, 'The "%s" attribute can\'t read for %s.'];
  EAttributeCantWrite = [8114, 'The "%s" attribute can\'t write for %s.'];
  ECreateClassTypeInstance = [8115, 'ClassType can\'t create instance.'];

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
  function cantWrite(v, n) { throw new Error(EAttributeCantWrite.concat([n, this.ClassInfo.ClassName])) }
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

    var Constructor = Attribute.caller;
    var cls = Constructor && Constructor.caller;
    return (cls && cls.set && cls.set(name, value));
  }
}();


/**
 * keyword, and class register function: Class()
 */
Class = function() {
  // all real Constructor()'s instance for Class
  var CLASSINFO = { };
  var UNDEFINED = { };
  var $getter_str = $QomoCoreFunction('Attribute.get');
  var $setter_str = $QomoCoreFunction('Attribute.set');
  var $inherited_str = $QomoCoreFunction('inherited');
  var $inherited_invalid = function() { throw new Error(EInvalidInherited) };
  var _joinpoints_ = new JoPoints();
  _joinpoints_.add('Initializtion');
  _joinpoints_.add('Initialized');

  eval($inline('Object(8).js', $Q('Interface')));

  // class's type info
  // - need not support namespace
  function ClassTypeinfo(cls, Attr) {
    this.class_ = cls;
    this.$Attr_ = Attr;
    this.next__ = CLASSINFO[cls.ClassName];
  }

  function getClassTypeinfo(cls) {
    var n=cls.ClassName, p=CLASSINFO[n];
    while (p && p.class_ !== cls) p = p.next__;

    if (p===undefined) throw new Error(EAccessInvaildClass);
    return p;
  }

  function setClassTypeinfo(cls, instance, Attr) {
    var n=cls.ClassName, p=CLASSINFO[n];
    while (p && p.class_ !== cls) p = p.next__;

    if (p!==undefined) throw new Error(EInvalidClass);
    cls.Create.prototype = instance;
    CLASSINFO[n] = new ClassTypeinfo(cls, Attr);
  }

  // get prototypeInfo and propertyName
  function getPrototype(cls) { return  (cls ? cls.Create.prototype : {}) }
  function getAttrPrototype(cls) { return getClassTypeinfo(cls).$Attr_ }
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

    function getAttribute(n) { return Attr[n] !== UNDEFINED ? Attr[n] : undefined }
    function setAttribute(n, v) { Attr[n] = v!==undefined ? v : UNDEFINED }
    function hasOwnProperty(n) { return _attributes[n] === UNDEFINED }

    var Name = arguments[1] ;
    var Parent = arguments[0];
    var cls = function (Constructor) {
      var parent = {};
      // create Class typeinfo node, add to class's prototype inherit tree.
      if (cls.ClassParent) {
        // call getClassTypeinfo()
        with (getClassTypeinfo(cls.ClassParent)) {
          parent = getPrototype(class_), Attr.prototype = $Attr_;
        }
        // check invaild call: new TObject()
        if (!Constructor || (Constructor.prototype != parent)) throw new Error(ECreateClassTypeInstance);
      }
      Attr = new Attr();
      Attr.hasOwnProperty = hasOwnProperty;

      var base = new Constructor();
      for (var i in base) {
        // check function, collection all events and attributes
        if (base[i] instanceof Function) {
          if (_r_event.test(i)) _events.push(i);
          if (_r_attribute.exec(i)) {
            Attr[i] = base[i];
            _attributes[i] = UNDEFINED;
            delete base[i];

            // if (!(RegExp.$2 in Attr)) Attr[RegExp.$2] = undefined;
            if (Attr[RegExp.$2] === undefined) Attr[RegExp.$2] = UNDEFINED;
            /*IE5:CONTINUE*/
          }
        }
        /*IE5:DIFFPUSH*/
      }
      setClassTypeinfo(cls, base, Attr);
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
      var a = inheritedAttribute(method);
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
            if (p.hasOwnProperty(n)) a.push(p[n]);
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
    });

    cls.OnClassInitialized = _joinpoints_.weaving('Initialized', function(IDB) {
      delete this.all;
      delete this.map;
      delete this.get;
      delete this.set;
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
  eval($inline('Object(5).js', $Q('Namespace')));

  // Real Class() keyword
  function _Class(Parent, Name) {
    var args = arguments;
    if (args.length==0) throw new Error(ECallClassBadArguments);

    if ((typeof args[0]=='string') || (args[0] instanceof String)) {
      return _Class.apply(this, [(args[0]=='Object' ? null : TObject)].concat(Array.prototype.slice.call(args, 0)));
    }

    if ((Parent !== null) && (typeof Parent != 'function' || !Parent.ClassInfo)) {
      throw new Error(ECallClassBadArguments);
    }

    // get a reference of the constructor foo
    var Constructor = (Name instanceof Function) ? Name : eval(Name);
    if (!(Constructor instanceof Function)) throw new Error(ERegClassNoname);

    // Class is a function
    // base is prototype of the class, and create from navtive Constructor
    var cls = new ClassDataBlock(Parent, (Name instanceof Function ? 'Anonymous' : Name));
    cls.OnClassInitializtion(Constructor);

    // some member reference for class
    var $all = cls.all;
    var $map = cls.map;

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
          if (this.get.caller!==data_[(args.length==1 ? 'get':'set') + n]) return;
        }
        else {
          // get custom-built getter from cls's $Attr.getXXXXXX
          // in ClassDataBlock, the ref. equ data_['get'+n]
          var f = data_['get'+n];
          if (f) return f.call(this, n);
        }

        if (data_[n] === UNDEFINED) return undefined;
        return data_[n]; // a value
      }

      this.set = function (n, v) {
        if (arguments.length==1) {
          v = n;
          var args = this.set.caller.arguments;
          n = args.length == 1 ? args[0] : args[1];
          if (this.set.caller!==data_[(args.length==1 ? 'get':'set') + n]) return;
        }
        else {
          var f = data_['set'+n];
          if (f) return f.call(this, v, n);
        }

        // if (n in data_) return void(data_[n]=v);
        if (v === undefined) v = UNDEFINED;
        if (data_[n] !== undefined) return void(data_[n]=v);
        throw new Error(EWriteUndefinedAttr.concat(n));
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
    var RECALL = { };
    cls.Create = function () {
      if (this===cls) {
        return new arguments.callee(RECALL, arguments);
      }
      else if (this instanceof arguments.callee) {
        // Make a DataBlock for per Instance, and reset attributes getter/setter.
        var Data = new InstanceDataBlock();
        this.get = Data.get;
        this.set = Data.set;
        this.inherited = Data.inherited;

        // MuEvents init(base per instance).
        var all = $all('event');
        for (var i=0, imax=all.length; i<imax; i++) this[all[i]] = new MuEvent();

        // class method to object method
        if (this.Create) this.Create.apply(this, arguments[0]===RECALL ? arguments[1] : arguments);
      }
      else {
        throw new Error(ECreateInstanceFail);
      }
    }

    eval($inline('Object(1).js', $Q('Interface')));
    eval($inline('Object(2).js', $Q('Interface')));

    // at after define cls.create(), do Init
    cls(Constructor);
    cls.OnClassInitialized(InstanceDataBlock);

    eval($inline('Object(3).js', $Q('Interface')));

    // set prototype properties for instance object
    cls.Create.toString = function() { return Constructor.toString() };
    cls.Create.prototype.constructor = cls.Create;
    cls.Create.prototype.ClassInfo = cls;

    // rewrite constructor function
    //   MyObject = TMyObject.Create;
    (Name instanceof Function) || eval(Name + '= cls.Create');

    // register class into current active namespace
    eval($inline('Object(6).js', $Q('Namespace')));

    // return Class type reference 'cls'
    return cls;
  }

  eval($inline('Object(4).js', $Q('Interface')));
  return _Class;
}();


/**
 * Object() and TObject Class for Qomo
 * Register TObject class, It's class inherit tree's root.
 * - If you want, you can set Object.prototype to other!!!
 */
void function() {
  var _RTLOBJECT = new Object();
  Object = function (){};
  Object.prototype = new _RTLOBJECT.constructor();
}();
TObject = Class('Object');

/**
 * Initinialize TObject or Object()
 */
eval($inline('Object(7).js', $Q('Interface')));

/**
 * Utility Functions _get(), _set(), _cls()
 * - need call in class register and init
 */
_get = function(n) { return _get.caller.caller.get(n) }
_set = function(n,v) { return _set.caller.caller.set(n, v) }
_cls = function() { return _cls.caller.caller }