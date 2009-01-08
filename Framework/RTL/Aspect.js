/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.28]

 - AOP Support Unit
 - Four Classes: TFunctionAspect, TClassAspect, TObjectAspect, TCustomAspect
   and a Abstract class: TAspect
 - support pointcut:
     for TFunctionAspect : 'Function'
     for TClassAspect  : 'Method'
     for TObjectAspect : 'Method', 'Event', 'AttrGetter', 'AttrSettter'
     for TCustomAspect : cutstom pointcut by user code in observable
*****************************************************************************/

var
  EPointCutAnalyzerNoPass = [8181, 'PointCut Analyzer No Pass.'];
  EHostMustImplementeIJoPoints = [8182, 'The host must implemente IJoPoints interface.'];

TOnAspectBehavior = function(observable, aspectname, pointcut, args) {};
TOnAspectAfter = function(observable, aspectname, pointcut, args, value) {};


/**
 * AOP base class
 */
function Aspect() {
  var GetHandle = {};

  Attribute(this, 'AspectHost', null, 'rw');
  Attribute(this, 'AspectName', null, 'rw');
  Attribute(this, 'AspectType', null, 'r'); // Class, Object or Custom
  Attribute(this, 'PointCut', '', 'rw');
  Attribute(this, 'MetaData', null, 'rw');
  Attribute(this, 'PointCutAnalyzer', null, 'r');

  function $Aspect(pointcut, foo) {
    var _aspect = this;
    var host = _aspect.get('AspectHost');
    var name = _aspect.get('AspectName');

    return function($A) {
      if ($A===GetHandle) return foo;

      var _intro = _aspect.OnIntroduction(this, name, pointcut, arguments) !== false;
      _intro  && _aspect.OnBefore(this, name, pointcut, arguments);

      var _cancel = _intro && _aspect.OnAround(this, name, pointcut, arguments) === false;
      var _value = _cancel ? undefined : foo.apply(this, arguments);
      _intro  && _aspect.OnAfter(this, name, pointcut, arguments, _value);

      return _value;
    }
  }

  this.supported = Abstract;
  _set('PointCutAnalyzer', function(pointcut) {
    return this.supported(pointcut);
  });

  this.assign = function(host, name, pointcut) { /* meta0 .. metan */
    this.set('AspectHost', host);
    this.set('AspectName', name);
    this.set('PointCut', pointcut);
    this.set('MetaData', Array.prototype.slice.call(arguments, 3));
    if (!(this.get('PointCutAnalyzer').call(this, pointcut))) {
      throw new Error(EPointCutAnalyzerNoPass);
    }

    return (host[name] instanceof Function ? host[name] = $Aspect.call(this, pointcut, host[name])
      : $Aspect.call(this, pointcut, host));
  }

  this.unassign = function() {
    var host = this.get('AspectHost');
    var name = this.get('AspectName');
    if (host && name && host[name] instanceof Function) {
      host[name] = host[name](GetHandle);
    }
    this.set('AspectHost', null);
  }

  var $Aspects = ['OnIntroduction', 'OnBefore', 'OnAfter', 'OnAround'];
  this.merge = function() { /* dest0 .. destn */
    if (arguments.length == 0) return;

    var args=arguments, argn=args.length;
    var f = function(e) {
      this[e] = new MuEvent(this[e]);
      for (var i=0; i<argn; i++) this[e].add(args[i][e]);
    }
    $Aspects.forEach(f, this);
  }

  this.combine = function() { /* dest0 .. destn */
    if (arguments.length == 0) return;

    var args=arguments, argn=args.length;
    var f = function(e) {
      this[e] = new MuEvent(this[e]);
      for (var i=0; i<argn; i++) {
        this[e].add(args[i][e]); // append to cast list
        args[i][e] = this[e];    // replace for dest0 .. destn
      }
    }
    $Aspects.forEach(f, this);
  }

  this.unmerge = function() {
    return this.uncombine();
  }

  this.OnIntroduction = TOnAspectBehavior;
  this.OnBefore = TOnAspectBehavior;
  this.OnAfter = TOnAspectAfter;
  this.OnAround = TOnAspectBehavior;

  this.Create = function() {
    with (this) {    // "with" scope
      this.uncombine = function() {
        this.OnIntroduction = OnIntroduction;
        this.OnBefore = OnBefore;
        this.OnAfter = OnAfter;
        this.OnAround = OnAround;
      }
    }
    if (arguments.length > 0) this.assign.apply(this, arguments);
  }
}


/**
 * Aspect for any functions, global or local
 */
function FunctionAspect() {
  _set('AspectType', 'Function');
  _set('PointCutAnalyzer', function(pointcut) {
    return (this.supported(pointcut) && !!this.get('AspectHost'));
  });

  var yes = {}, supported = { Function: yes };
  this.supported = function(pointcut) {
    return supported[pointcut] === yes;
  }

  this.assign = function(host, name, pointcut) {
    var f = this.inherited();
    name && eval(name + ' = f'); // rewrite global identifier
    return f;
  }
}


/**
 * Aspect for Class, join to prototype method only.
 */
function ClassAspect() {
  _set('AspectType', 'Class');
  _set('PointCutAnalyzer', function(pointcut) {
    if (this.supported(pointcut)){
      var n = this.get('AspectName');
      switch (pointcut) {
        case 'Method': return (this.get('AspectHost')[n] instanceof Function);
      }
    }
  });

  var yes = {}, supported = { Method: yes };
  this.supported = function(pointcut) {
    return supported[pointcut] === yes;
  }

  this.assign = function(host, name, pointcut) {
    var hh = (host['ClassInfo'] ? host.Create : host.constructor).prototype; // hh is true host
    var f, h = host; // backup
    host = hh; // rewrite arguments
    f = this.inherited();
    this.set('AspectHost', h);

    this.unassign = function() {
      this.set('AspectHost', hh);
      this.inherited();
    }

    return f;
  }
}


/**
 * Aspect for Object, join to attribute's get/set, event and method.
 */
function ObjectAspect() {
  _set('AspectType', 'Object');

  _set('PointCutAnalyzer', function(pointcut) {
    var obj = this.get('AspectHost');
    if (this.supported(pointcut)){
      var n = this.get('AspectName');
      switch (pointcut) {
        case 'AttrGetter':
        case 'AttrSetter': return (obj instanceof TObject.Create);
        case 'Event': if (!_r_event.test(n)) return false;
        case 'Method': return (obj[n] instanceof Function);
      }
    }
  });

  var yes = {}, supported = { AttrGetter: yes, AttrSetter: yes, Method: yes, Event: yes };
  this.supported = function(pointcut) {
    return supported[pointcut] === yes;
  }

  this.assign = function(host, name, pointcut) {
    var n=name, f=host[n];

    // rewrite arguments
    switch (pointcut) {
      case 'AttrGetter': name = 'get'; break;
      case 'AttrSetter': name = 'set'; break;
    }

    var adpa = this.inherited();
    if (pointcut == 'AttrGetter' || pointcut == 'AttrSetter') {
      this.set('AspectName', n);
      return (host[name] = function(attr) {
        return ((arguments.length>0 && attr==n) ? adpa : f).apply(this, arguments);
      });
    }
    return adpa;
  }
}

/**
 * Aspect for Custom JoinPoint(s), join to IJoPoints interface by any function(and object).
 */
function CustomAspect() {
  _set('AspectType', 'Custom');

  this.setAspectHost = function(v) {
    var pts = Interface.QueryInterface(v, IJoPoints);
    if (!pts) throw new Error(EHostMustImplementeIJoPoints);
    this.unassign();
    this.set(v);
  }

  this.supported = function(pointcut) {
    var pts, host = this.get('AspectHost');
    return (host && (pts=Interface.QueryInterface(host, IJoPoints)) && pts.items(pointcut));
  }

  this.assign = function(host, name, pointcut) {
    this.set('AspectHost', host);
    this.set('AspectName', name);
    this.set('PointCut', pointcut);
    this.set('MetaData', Array.prototype.slice.call(arguments, 3));
    if (this.supported(pointcut)) {
      var pts = Interface.QueryInterface(this.get('AspectHost'), IJoPoints);
      var pt = pts.items(pointcut);
      return pt.assign(name, this);
    }
  }

  this.unassign = function() {
    var host = this.get('AspectHost');
    if (host) {
      var pts = Interface.QueryInterface(host, IJoPoints);
      var pt = pts.items(this.get('PointCut'));
      pt.unassign(this.get('AspectName'));
    }
  }
}


/**
 * Class Register for AOP Framework
 */
TAspect = Class(TObject, 'Aspect', IAspect);
TFunctionAspect = Class(TAspect, 'FunctionAspect');
TClassAspect = Class(TAspect, 'ClassAspect');
TObjectAspect = Class(TAspect, 'ObjectAspect');
TCustomAspect = Class(TAspect, 'CustomAspect');