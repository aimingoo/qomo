/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.04.23]

 - System utils functions
*****************************************************************************/

/**
 * get a unique id in global and future system environment
 */
function createUniqueID(){
  return '_' + new Date().valueOf() + Math.random();
}

/**
 * get a unique variant in global, and you can delete it everytime
 */
function createUniqueVar() {
  var name = createUniqueID().replace('.', '_');
  window.execScript(name+'=void null;', 'JavaScript');
  return name;
}

/**
 * check a string is a global variant.
 */
function isVariant(/* variant name string */) {
  try {
    eval(arguments[0]);
    return true;
  }
  catch (e) {
    return false;
  }
}

/**
 * check qomo types system.
 */

// check for TMyObject
function IsClass(cls) {
  if (arguments[1]) return IsClass2.apply(this, arguments);
  return (cls instanceof Function) && cls.Create && cls.ClassParent/* && cls.prototype instanceof TObject.prototype*/
}

// return "cls is clsParent"
function IsClass2(cls, clsParent) {
  do {
    if (cls == clsParent) return true;
  } while (cls && (cls = cls['ClassParent']));
  return false;
}

// check for obj instance by new MyObject()
function IsObject(obj) {
  return obj && obj.ClassInfo && IsClass(obj.ClassInfo); // && (obj instanceof obj.ClassInfo.Create);
}

// check for MyObject()
function IsConstructor(constructor) {
  return IsObject(constructor.prototype);
}

function IsInterface(intf) {
  return Interface.IsInterface(intf)
}

function HasInterface(obj, intf) {
  return !!Interface.QueryInterface(obj, intf);
}

/**
 * check a variant is defined.
 */
function defined(v) {
  return v !== void null;
}

/**
 * safed eVALUAtor
 */
function toEtor(foo) {
  return foo.toString().replace(/^[\(\s]+|[\)\s]+$/g, '').replace(/(function\b)[^\(]*([^\$]*)/, "[$1$2][0]");
}

/**
 * pattern and pattern's data format
 */
Pattern = function() {
  function fmt_Pattern(patt) {
    return ('$'+patt.join('|,$')).split('|,');
  }

  function fmt_NumberRow(count) {
    return (count < 2 ? (count == 1 ? '(.*?),|$' : '')
      : (new Array(count).join('(.*?),')) + '([^,]*),?');
  }

  function _Pattern(source) {
    if (source) this.source = source;
  }
  _Pattern.prototype.source = ''; // source, with wildcard character '%x'
  _Pattern.prototype.format = []; // format, is wildcard_character's position of [this.data]
  _Pattern.prototype.data = [];   // data prvider, a formated table or array or ...
  _Pattern.prototype.style = 0;   // data prvider's style, default is number of element for dataSet's row;

  _Pattern.prototype.pattern = function(data, format, style) {
    var d = data || this.data;
    var f = format || this.format;
    var s = style || this.style || (d[0] instanceof Array && d[0].length) || 1;
    return d.toString().replace(
      new RegExp(fmt_NumberRow(s), 'g'),
      String.format(this.source, fmt_Pattern(f)));
  }

  return _Pattern;
}();