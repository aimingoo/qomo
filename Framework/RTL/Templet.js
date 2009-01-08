/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.02.28]

 - Templet Support Unit
*****************************************************************************/

function Templet() {
  Attribute(this, 'TempletContext', '');

  var _r_templet = /\%(.*?)\%/gi;
  var _toString = function(src) {  /* %..% */
    var i = Interface.QueryInterface(src=src||this, IAttrProvider);
    var v = { 'TempletContext': '%TempletContext%' };

    return this.get('TempletContext').replace(_r_templet, function($0, $1) {
      return ($1=='' ? '%' : (v.hasOwnProperty($1) ? v[$1]
        : (v[$1] = i.hasAttribute($1, 'r') ? src.get($1) : $0)));
    });
  }

  this.toString = _toString;
  this.Create = function(src) {
    if (src && Interface.QueryInterface(src, IAttrProvider)) {
      this.toString = function() { return _toString.call(this, src) }
    }
  }
}

TTemplet = Class(TObject, 'Templet');