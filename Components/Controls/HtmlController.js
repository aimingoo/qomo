/*****************************************************************************
*
* Qomo Constrols - THtmlController
*
*****************************************************************************/

// var
  EAssignTargetNoExist = [8301, 'try assign a control, but target element is no exists.'];
  TOnAssigned = function (el) {};

function HtmlController() {
  var _DOM_Elem = '_DOM_Element';

  Attribute(this, _DOM_Elem, null, 'p');
  Attribute(this, 'ImmediateBind', true, 'r');

  // hook html elements events
  this.hookEvents = function() {
    var args = arguments, events = ((args.length==1) && (args[0] instanceof Array)) ? args[0]:args;
    var DOM = this.get(_DOM_Elem);
    hookHtmlEvents.call(this, DOM, events);
  }

  this.OnAssigned = TOnAssigned;
  this.assign = function(Id, byName, subIndex) {
    var el = Id;
    if (typeof Id == 'string') {
      if ((arguments.length==2) && byName) subIndex = 0;
      el = (byName) ? document.getElementsByName(Id)[subIndex] : document.getElementById(Id);
    }
    this.set(_DOM_Elem, el);
    this.assignedElement = el;
    this.OnAssigned(el);
  }

  var _AttrProviderReplace = function() {
    var $get = this.get;
    var $set = this.set;
    var $all = Interface.QueryInterface(this, IAttributes);

    // rewrite get/set to access DOM
    this.get = function(n) {
      if (arguments.length==0) return $get.call(this);

      var el, v;
      if (!$all.names(n) && (el=$get.call(this, _DOM_Elem))) {
        var v = el.getAttribute(n, 1);
        if (v !== null) return v;  // is DOM's Attribute
        if (n in el) return el[n]; // is Element Object's property
      }
      // is Qomo's Attributes, if isn't, $get() will throw a exception
      return $get.call(this, n);
    }

    this.set = function(n, v) {
      if (arguments.length==1) return $set.call(this, arguments[0]);

      // check old attribute value
      switch ($get.call(this, n)) { // attr from Qomo's framework
        case v : return;
        case undefined : {
          var el = $get.call(this, _DOM_Elem);
          if (n in el) return void(el[n] = v);
          if (el.getAttribute(n, 1) !== null) return void(el.setAttribute(n, v));
        }
        default :
          $set.call(this, n, v);
      }
    }
  }

  this.Create = function(Id, byName, subIndex) {
    // replace once only!
    _AttrProviderReplace.call(this);
    // assign within create()
    if (arguments.length>0) this.assign.apply(this, arguments);
    // replace the create() method
    this.Create = this.assign;
  }

/**
 * Adv: interface replace in class registeing.
 *  see also: asp.OnBefore.add() at next...
 */
}

// aspects for class THtmlController.
void function() {
  var asp = new CustomAspect(Class, 'THtmlController_SubClass_Init', 'Initialized')
  asp.OnIntroduction.add(function(cls, n, p, a) {
    do { if (cls.ClassName=='THtmlController') return } while (cls=cls.ClassParent);
    return false;
  });
  asp.OnBefore.add(function(cls, n, p, a) {
    // 1. get old interface and methods.
    var intf = Interface.QueryInterface(cls.Create, IAttrProvider);  // "cls" get by _cls() in course of registration
    var has = intf.hasAttribute;
    var hasOwn = intf.hasOwnAttribute;

    // 2. define a proxy function
    //   - in : instance of the HtmlController Class or sub-class.
    //   - out: a obj, it's a instance with delegated interface.
    function proxy(obj) {
      return {
        hasAttribute: function(n, t) {
          var t2 = ('rw*'.indexOf(t)>-1 ? 0 : parseInt(t));
          return (obj.assignedElement.getAttribute(n, t2) !== null ? true : has.apply(intf, arguments))  
        },
        hasOwnAttribute: function(n, t) {
          var t2 = ('rw*'.indexOf(t)>-1 ? 0 : parseInt(t));
          return (obj.assignedElement.getAttribute(n, t2) !== null ? true : hasOwn.apply(intf, arguments))  
        }
      }
    }

    // 3. re-delegate interface
    Delegate(cls.Create, [
      [proxy, ['IAttrProvider']]
    ]);
  });
}();

THtmlController = Class(TObject, 'HtmlController');